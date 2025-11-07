import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useSocketIOWidget } from "../hooks/useSocketIOWidget";
import { generateUUID, getPositionClasses, log, type WidgetPosition } from "../utils/utils";
import { FloatingButton } from "./FloatingButton";
import { ChatWindow } from "./ChatWindow";
import { Message, MessageRole } from "../types/types";

const shadowStyles = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }
`;

interface FloatingChatWidgetProps {
  conversationalAgentId: string;
  sessionId?: string;
  asAgent?: boolean;
  position?: WidgetPosition;
  primaryColor?: string;
  botName?: string;
  apiUrl: string;
  token?: string;
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  conversationalAgentId,
  sessionId: initialSessionId,
  asAgent = false,
  position = "bottom-right",
  primaryColor = "#10b981",
  botName = "AI Assistant",
  apiUrl,
  token,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || shadowRootRef.current) return;
    
    const shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
    shadowRootRef.current = shadowRoot;
    
    const reactRoot = document.createElement('div');
    shadowRoot.appendChild(reactRoot);
    
    const style = document.createElement('style');
    style.textContent = shadowStyles;
    shadowRoot.appendChild(style);
    
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(elem => {
      shadowRoot.appendChild(elem.cloneNode(true));
    });
    
    setIsMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false);

  const [sessionId] = useState<string>(() => {
    const id = initialSessionId || generateUUID();
    log("🆔 Session ID generado:", id);
    return id;
  });

  const isOpenRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const handleUnreadIncrement = () => {
    if (!isOpenRef.current) {
      log("Increase unread count");
      setUnreadCount((prev) => prev + 1);
    }
  };

  const { sendMessage, currentClientId } = useSocketIOWidget({
    apiUrl: apiUrl,
    agentId: conversationalAgentId,
    sessionId: sessionId,
    asAgent,
    enabled: hasConnectedOnce,
    isOpen,
    token: token,
    onMessagesUpdate: setMessages,
    onThinkingChange: setThinking,
    onBotTypingChange: setBotTyping,
    onConnectedChange: setWsConnected,
    onLoadingChange: setLoading,
    onUnreadIncrement: handleUnreadIncrement,
  });

  const toggleChat = () => {
    if (!isOpen) {
      setUnreadCount(0);
      if (!hasConnectedOnce) {
        log("🔌 Primera apertura del chat - iniciando conexión Socket.IO");
        setHasConnectedOnce(true);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!input.trim() || !wsConnected) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    const messageRole: MessageRole = asAgent ? "human_agent" : "user";
    const sent = sendMessage(userMessage, messageRole);

    if (sent) {
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  };

  const chatContent = (
    <div className={`fixed ${getPositionClasses(position)} z-50 flex flex-col items-end gap-1`}>
      {isOpen && (
        <ChatWindow
          messages={messages}
          thinking={thinking}
          loading={loading}
          botTyping={botTyping}
          wsConnected={wsConnected}
          asAgent={asAgent}
          input={input}
          primaryColor={primaryColor}
          botName={botName}
          currentClientId={currentClientId}
          onInputChange={setInput}
          onSend={handleSendMessage}
          onClose={toggleChat}
        />
      )}

      <FloatingButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        primaryColor={primaryColor}
        onClick={toggleChat}
      />
    </div>
  );

  if (!isMounted) {
    return <div ref={containerRef} />;
  }

  return (
    <>
      <div ref={containerRef} />
      {ReactDOM.createPortal(chatContent, shadowRootRef.current!.children[0])}
    </>
  );
};

export default FloatingChatWidget;