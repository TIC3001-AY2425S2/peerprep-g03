export type MatchConnectionEstablishedMessage = {
  type: "CONNECTION_ESTABLISHED";
  timestamp: number;
};

export type MatchFoundMessage = {
  type: "MATCH_FOUND";
  match: {
    userId: string;
    topic: string;
    difficulty: string;
    sessionId: string;
    questionId: number;
  };
};

export type MatchTimeoutMessage = {
  type: "MATCH_TIMEOUT";
  message: string;
};

export type MatchCancelledMessage = {
  type: "CANCELLED";
};

export type MatchWebSocketMessage =
  | MatchConnectionEstablishedMessage
  | MatchFoundMessage
  | MatchTimeoutMessage
  | MatchCancelledMessage;
