import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message, MessageRole } from "../types/types";
import { CONVERSATIONAL_AGENTS_API_PATH } from "../core/config";
import { log } from "../utils/utils";

interface UseSocketIOWidgetProps {
  apiUrl: string;
  agentId: string;
  sessionId: string;
  asAgent: boolean;
  enabled: boolean;
  isOpen: boolean;
  token?: string;
  onMessagesUpdate: (updater: (prev: Message[]) => Message[]) => void;
  onThinkingChange: (thinking: boolean) => void;
  onBotTypingChange: (typing: boolean) => void;
  onConnectedChange: (connected: boolean) => void;
  onLoadingChange: (loading: boolean) => void;
  onUnreadIncrement: () => void;
}

export const useSocketIOWidget = ({
  apiUrl,
  agentId,
  sessionId,
  asAgent,
  enabled,
  isOpen,
  token,
  onMessagesUpdate,
  onThinkingChange,
  onBotTypingChange,
  onConnectedChange,
  onLoadingChange,
  onUnreadIncrement,
}: UseSocketIOWidgetProps) => {
  const socketRef = useRef<Socket | null>(null);
  const currentBotMessageRef = useRef<string>("");
  const currentClientIdRef = useRef<string | null>(null);
  const pendingBotMessageIndexRef = useRef<number | null>(null);
  const isOpenRef = useRef<boolean>(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(
    (message: string, role: MessageRole = "user") => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("send_message", {
          message,
          payload: { source: "widget" },
          broadcast: true,
          role,
        });
        log(`📤 Widget sent message: "${message}" (role: ${role})`);
        return true;
      }
      return false;
    },
    []
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!agentId || !sessionId) {
      log("⚠️ Missing agentId or sessionId");
      return;
    }

    if (socketRef.current?.connected) {
      log("✅ Socket already connected, reusing connection");
      return;
    }

    log("🔄 Connecting to Socket.IO Widget:", apiUrl);
    log("🆔 Agent ID:", agentId);
    log("🔑 Session ID:", sessionId);

    const socket = io(apiUrl, {
      path: CONVERSATIONAL_AGENTS_API_PATH,
      transports: ["websocket", "polling"],
      query: {
        agent_id: agentId,
      },
      auth: {
        room_id: sessionId,
        as_agent: asAgent,
        token: token,
      },
    });

    socket.on("connect", () => {
      log("✅ Socket.IO Widget conectado", socket.id);
      onConnectedChange(true);
    });

    socket.on("disconnect", (reason) => {
      log("🔌 Socket.IO Widget desconectado:", reason);
      onConnectedChange(false);
      currentClientIdRef.current = null;
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión Widget:", error);
      onConnectedChange(false);
    });

    socket.on("message", (data) => {
      log("📩 Widget Received:", data.type, data);

      try {
        if (data.type === "bot_message" && !isOpenRef.current) {
          log("Increase unread count");
          onUnreadIncrement();
        }

        if (data.type === "user_joined") {
          if (data.room_id === sessionId) {
            currentClientIdRef.current = data.client_id;
            log("🆔 Our client_id:", data.client_id);
          }
        } else if (data.type === "user_left") {
        } else if (data.type === "user_message") {
          const messageRole: MessageRole = data.role || "user";

          onMessagesUpdate((prev) => [
            ...prev,
            {
              role: messageRole,
              content: data.content,
              clientId: data.client_id,
            },
          ]);
        } else if (data.type === "thinking") {
          onThinkingChange(true);
        } else if (data.type === "stop_thinking") {
          onThinkingChange(false);
        } else if (data.type === "bot_typing") {
          onBotTypingChange(data.typing);

          if (data.typing) {
            onMessagesUpdate((prev) => {
              const hasPending = prev.some(
                (m) => m.pending && m.role === "ai_agent"
              );

              if (!hasPending) {
                const newMessages = [
                  ...prev,
                  {
                    role: "ai_agent" as const,
                    content: "",
                    pending: true,
                  },
                ];
                pendingBotMessageIndexRef.current = newMessages.length - 1;
                return newMessages;
              }
              return prev;
            });
            currentBotMessageRef.current = "";
          } else {
            onMessagesUpdate((prev) => prev.map((m) => ({ ...m, pending: false })));
            pendingBotMessageIndexRef.current = null;
          }
        } else if (data.type === "token") {
          currentBotMessageRef.current += data.content;

          onMessagesUpdate((prev) => {
            const updatedMessages = [...prev];
            const pendingIndex =
              pendingBotMessageIndexRef.current !== null
                ? pendingBotMessageIndexRef.current
                : updatedMessages.findIndex(
                  (m) => m.pending && m.role === "ai_agent"
                );

            if (pendingIndex !== -1) {
              updatedMessages[pendingIndex] = {
                ...updatedMessages[pendingIndex],
                content: currentBotMessageRef.current,
              };
            }

            return updatedMessages;
          });
        } else if (data.type === "bot_message") {
          onMessagesUpdate((prev) =>
            prev.map((m) =>
              m.pending && m.role === "ai_agent"
                ? { ...m, content: data.content, pending: false }
                : m
            )
          );

          currentBotMessageRef.current = "";
          pendingBotMessageIndexRef.current = null;
          onLoadingChange(false);
        } else if (data.type === "error") {
          console.error("❌ Server error:", data.content);
          onMessagesUpdate((prev) => [
            ...prev.filter((m) => !m.pending),
            {
              role: "system" as const,
              content: `❌ Error: ${data.content}`,
            },
          ]);
          onLoadingChange(false);
          onThinkingChange(false);
          onBotTypingChange(false);
          currentBotMessageRef.current = "";
          pendingBotMessageIndexRef.current = null;
        }
      } catch (e) {
        console.error("❌ Error processing message:", e);
      }
    });

    socketRef.current = socket;

    return () => {
      log("🧹 Cleanup: desconectando socket");
      disconnect();
    };
  }, [enabled, agentId, sessionId, asAgent]);

  return {
    sendMessage,
    disconnect,
    isConnected: socketRef.current?.connected || false,
    currentClientId: currentClientIdRef.current,
  };
};