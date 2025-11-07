import React from "react";

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <span
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-sm">Thinking...</span>
        </div>
      </div>
    </div>
  );
};