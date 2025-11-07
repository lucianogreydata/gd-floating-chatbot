import { useState, useCallback } from "react";
import { generateUUID } from "../utils/utils";
import type { Session } from "../types/types";

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const createSession = useCallback((id?: string) => {
    const newSession: Session = {
      id: id || generateUUID(),
      messages: [],
      roomMembers: [],
      memberCount: 0,
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setActiveSessionId((current) => (current === id ? null : current));
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    createSession,
    deleteSession,
  };
};