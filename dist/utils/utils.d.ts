import type { MessageRole, MessageStyles } from "../types/types";
export declare const generateUUID: () => string;
export declare const getMessageStyles: (role: MessageRole, asAgent: boolean) => MessageStyles;
export type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export declare const getPositionClasses: (position: WidgetPosition) => string;
interface WidgetMessageStyles {
    bg: string;
    text: string;
    justify: string;
}
export declare const getWidgetMessageStyles: (role: MessageRole, asAgent: boolean, primaryColor: string) => WidgetMessageStyles;
export declare const log: (...args: any[]) => void;
export {};
//# sourceMappingURL=utils.d.ts.map