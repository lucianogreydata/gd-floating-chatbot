import React from "react";
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
export declare const ChatWindow: React.FC<ChatWindowProps>;
export {};
//# sourceMappingURL=ChatWindow.d.ts.map