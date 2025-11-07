import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import type { Message } from "../types/types";

interface ChatWindowProps {
  messages: Message[];
  thinking: boolean;
  loading: boolean;
  botTyping: boolean;
  wsConnected: boolean;
  asAgent: boolean;
  input: string;
  primaryColor: string;
  botName: string;
  currentClientId: string | null;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  thinking,
  loading,
  botTyping,
  wsConnected,
  asAgent,
  input,
  primaryColor,
  botName,
  currentClientId,
  onInputChange,
  onSend,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!asAgent && !loading && !thinking && !botTyping && wsConnected && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [loading, thinking, botTyping, wsConnected, asAgent]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const getPlaceholder = () => {
    if (!wsConnected) return "Connecting...";
    if (!asAgent && (loading || thinking || botTyping)) return "AI is responding...";
    return "Type a message...";
  };

  const isInputDisabled = !wsConnected || (!asAgent && (loading || thinking || botTyping));

  return (
    <div
      className="bg-white rounded-lg shadow-2xl transition-all duration-300 h-[600px] w-[380px] flex flex-col overflow-hidden"
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 text-white flex items-center justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <div className="font-semibold">{botName}</div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-300" : "bg-red-300"
                  }`}
              />
              <span>{wsConnected ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
        <div
          onClick={onClose}
          className="hover:bg-white/20 p-1.5 rounded transition"
          title="Close"
        >
          ✕
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => {
          const isMyMessage = msg.clientId === currentClientId;
          return (
            <ChatMessage
              key={idx}
              message={msg}
              asAgent={asAgent}
              primaryColor={primaryColor}
              botName={botName}
              isMyMessage={isMyMessage}
            />
          );
        })}

        {thinking && <ThinkingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            readOnly={isInputDisabled}
            disabled={isInputDisabled}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: `0 0 0 2px ${primaryColor}33`,
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 0 0 2px ${primaryColor}`;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = `0 0 0 2px ${primaryColor}33`;
            }}
          />
          <div
            onClick={onSend}
            className="rounded-full p-2 text-white transition-all cursor-pointer
                       hover:opacity-90 flex"
            style={{
              backgroundColor: primaryColor,
              opacity: isInputDisabled ? 0.5 : 1,
              pointerEvents: isInputDisabled ? 'none' : 'auto',
              cursor: isInputDisabled ? 'not-allowed' : 'pointer'
            }}
            title="Send"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isInputDisabled) {
                onSend();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};