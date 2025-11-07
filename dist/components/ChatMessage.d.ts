import React from "react";
import type { Message } from "../types/types";
import "../styles/markdown-body.css";
interface ChatMessageProps {
    message: Message;
    asAgent: boolean;
    primaryColor: string;
    botName: string;
    isMyMessage: boolean;
}
export declare const ChatMessage: React.FC<ChatMessageProps>;
export {};
//# sourceMappingURL=ChatMessage.d.ts.map