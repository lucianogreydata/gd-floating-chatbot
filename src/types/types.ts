export type MessageRole = "user" | "ai_agent" | "human_agent" | "system";

export interface Message {
  role: MessageRole;
  content: string;
  pending?: boolean;
  clientId?: string;
}

export interface Session {
  id: string;
  messages: Message[];
  roomMembers?: string[];
  memberCount?: number;
}

export interface SocketConfig {
  apiUrl: string;
  agentId: string;
  roomId: string;
  asAgent: boolean;
}

export interface MessageStyles {
  bg: string;
  text: string;
  justify: string;
}