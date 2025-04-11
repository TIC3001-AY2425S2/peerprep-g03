import { ReadyState } from "react-use-websocket";
import type { MatchWebSocketMessage } from "../types/MatchMessage";

type HandleMatchMessageParams = {
  message: MatchWebSocketMessage;
  onMatched: (userId: string) => void;
  onTimeout: (msg?: string) => void;
  onCancelled: () => void;
};

export const createStartMatchPayload = ({
  userId,
  topic,
  difficulty,
}: {
  userId: string;
  topic: string;
  difficulty: string;
}) => ({
  type: "START_MATCH",
  userId,
  data: {
    topic,
    difficulty,
  },
});

export const isWebSocketConnected = (readyState: ReadyState) =>
  readyState === ReadyState.OPEN;

export const handleMatchMessage = ({
  message,
  onMatched,
  onTimeout,
  onCancelled,
}: HandleMatchMessageParams) => {
  switch (message.type) {
    case "MATCH_FOUND":
      onMatched(message.match?.userId || "Unknown");
      break;
    case "MATCH_TIMEOUT":
      onTimeout(message.message);
      break;
    case "MATCH_CANCELLED":
      onCancelled();
      break;
    default:
      console.warn("Unhandled WebSocket message:", message);
  }
};
