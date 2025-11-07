import { Message, MessageRole } from "../types/types";
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
export declare const useSocketIOWidget: ({ apiUrl, agentId, sessionId, asAgent, enabled, isOpen, token, onMessagesUpdate, onThinkingChange, onBotTypingChange, onConnectedChange, onLoadingChange, onUnreadIncrement, }: UseSocketIOWidgetProps) => {
    sendMessage: (message: string, role?: MessageRole) => boolean;
    disconnect: () => void;
    isConnected: boolean;
    currentClientId: string | null;
};
export {};
//# sourceMappingURL=useSocketIOWidget.d.ts.map