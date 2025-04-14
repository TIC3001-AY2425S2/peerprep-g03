import { ReadyState } from "react-use-websocket";
import type {
  MatchCancelledMessage,
  MatchFoundMessage,
  MatchTimeoutMessage,
  MatchWebSocketMessage,
} from "../types/MatchMessage";

type HandleMatchMessageParams = {
  message: MatchWebSocketMessage;
  onMatched: (msg: MatchFoundMessage) => void;
  onTimeout: (msg: MatchTimeoutMessage) => void;
  onCancelled: (msg: MatchCancelledMessage) => void;
};

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
      onMatched(message);
      break;
    case "MATCH_TIMEOUT":
      onTimeout(message);
      break;
    case "CANCELLED":
      onCancelled(message);
      break;
    case "CONNECTION_ESTABLISHED":
      console.info("WebSocket connection established:", message.timestamp);
      break;
    default:
      console.warn("Unhandled WebSocket message:", message);
  }
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
