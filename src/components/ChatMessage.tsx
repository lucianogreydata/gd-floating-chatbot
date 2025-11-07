import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getWidgetMessageStyles } from "../utils/utils";
import type { Message } from "../types/types";
import "../styles/markdown-body.css";

interface ChatMessageProps {
  message: Message;
  asAgent: boolean;
  primaryColor: string;
  botName: string;
  isMyMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  asAgent,
  primaryColor,
  botName,
  isMyMessage,
}) => {
  const styles = getWidgetMessageStyles(message.role, asAgent, primaryColor);

  return (
    <div className={`flex ${styles.justify}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${styles.text}`}
        style={{
          backgroundColor: styles.bg,
        }}
      >
        {message.role !== "system" && (
          <div className="text-xs opacity-70 mb-1">
            {message.role === "user" && "👤 You"}
            {message.role === "human_agent" && "👨‍💼 Agent"}
            {message.role === "ai_agent" && `🤖 ${botName}`}
          </div>
        )}

        {message.pending && !message.content && (
          <span className="italic opacity-70">Typing...</span>
        )}

        {message.content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="markdown-body"
            components={{
              code({ inline, children, ...props }: any) {
                const content = String(children).replace(/\n$/, "");
                return !inline ? (
                  <pre className="bg-gray-800 p-2 rounded text-sm overflow-x-auto my-2 text-gray-100">
                    <code {...props}>{content}</code>
                  </pre>
                ) : (

                  <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-gray-800">
                    {content}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {message.pending && message.content && (
          <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
        )}
      </div>
    </div>
  );
};