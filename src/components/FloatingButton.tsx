import React from "react";

interface FloatingButtonProps {
  isOpen: boolean;
  unreadCount: number;
  primaryColor: string;
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  isOpen,
  unreadCount,
  primaryColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative w-14 h-14 rounded-full text-white shadow-xl 
                 hover:scale-110 transition-transform duration-200
                 flex items-center justify-center text-2xl"
      style={{ backgroundColor: primaryColor }}
      title={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? "✕" : "💬"}

      {!isOpen && unreadCount > 0 && (
        <div
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                     rounded-full w-6 h-6 flex items-center justify-center
                     font-bold animate-pulse"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </div>
  );
};