import type { Session } from "../types/types";
export declare const useChatSessions: () => {
    sessions: Session[];
    setSessions: import("react").Dispatch<import("react").SetStateAction<Session[]>>;
    activeSessionId: string | null;
    setActiveSessionId: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    activeSession: Session | undefined;
    createSession: (id?: string) => Session;
    deleteSession: (id: string) => void;
};
//# sourceMappingURL=useChatSessions.d.ts.map