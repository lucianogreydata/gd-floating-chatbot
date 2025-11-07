import React from "react";
import { type WidgetPosition } from "../utils/utils";
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
declare const FloatingChatWidget: React.FC<FloatingChatWidgetProps>;
export default FloatingChatWidget;
//# sourceMappingURL=FloatingChatWidget.d.ts.map