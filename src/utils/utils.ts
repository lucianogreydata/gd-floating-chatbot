import { IS_DEVELOPMENT } from "../core/config";
import type { MessageRole, MessageStyles } from "../types/types";

export const generateUUID = (): string => {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID().slice(0, 16).replaceAll("-", "_");
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .slice(0, 16)
    .replaceAll("-", "_");
};


export const getMessageStyles = (
  role: MessageRole,
  asAgent: boolean
): MessageStyles => {
  let justify = "justify-center";

  if (role === "system") {
    justify = "justify-center";
  } else if (asAgent) {
    if (role === "human_agent") {
      justify = "justify-end";
    } else {
      justify = "justify-start";
    }
  } else {
    if (role === "user") {
      justify = "justify-end";
    } else {
      justify = "justify-start";
    }
  }

  switch (role) {
    case "user":
      return {
        bg: "bg-blue-600",
        text: "text-white",
        justify,
      };
    case "human_agent":
      return {
        bg: "bg-purple-600",
        text: "text-white",
        justify,
      };
    case "ai_agent":
      return {
        bg: "bg-gray-700",
        text: "text-gray-200",
        justify,
      };
    case "system":
      return {
        bg: "bg-gray-600",
        text: "text-gray-300 text-sm italic",
        justify,
      };
    default:
      return {
        bg: "bg-gray-700",
        text: "text-gray-200",
        justify,
      };
  }
};


export type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export const getPositionClasses = (position: WidgetPosition): string => {
  switch (position) {
    case "bottom-right":
      return "bottom-4 right-4";
    case "bottom-left":
      return "bottom-4 left-4";
    case "top-right":
      return "top-4 right-4";
    case "top-left":
      return "top-4 left-4";
    default:
      return "bottom-4 right-4";
  }
};

interface WidgetMessageStyles {
  bg: string;
  text: string;
  justify: string;
}

export const getWidgetMessageStyles = (
  role: MessageRole,
  asAgent: boolean,
  primaryColor: string
): WidgetMessageStyles => {
  let justify = "justify-center";

  if (role === "system") {
    justify = "justify-center";
  } else if (asAgent) {
    if (role === "human_agent") {
      justify = "justify-end";
    } else {
      justify = "justify-start";
    }
  } else {
    if (role === "user") {
      justify = "justify-end";
    } else {
      justify = "justify-start";
    }
  }

  switch (role) {
    case "user":
      return { bg: primaryColor, text: "text-white", justify };
    case "human_agent":
      return { bg: "#9333ea", text: "text-white", justify };
    case "ai_agent":
      return { bg: "#f3f4f6", text: "text-gray-900", justify };
    case "system":
      return { bg: "#e5e7eb", text: "text-gray-600 text-sm italic", justify };
    default:
      return { bg: "#f3f4f6", text: "text-gray-900", justify };
  }
};


export const log = (...args: any[]) => {
  if (IS_DEVELOPMENT) {
    console.log(...args);
  }
};
