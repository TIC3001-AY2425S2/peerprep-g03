export type MatchWebSocketMessage =
  | {
      type: "MATCH_FOUND";
      match: {
        userId: string;
        topic: string;
        difficulty: string;
      };
    }
  | {
      type: "MATCH_TIMEOUT";
      message: string;
    }
  | {
      type: "MATCH_CANCELLED";
    };
