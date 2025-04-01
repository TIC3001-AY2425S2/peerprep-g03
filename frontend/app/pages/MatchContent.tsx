import { Button, Card, Select, Space, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { DIFFICULTY_ORDER } from "../constant";
import { useAuth } from "../contexts/AuthContext";
import {
  createStartMatchPayload,
  handleMatchMessage,
  isWebSocketConnected,
} from "../services/match-services";
import { fetchQuestionCategories } from "../services/question-services";
import type { MatchWebSocketMessage } from "../types/MatchMessage";

const { Title, Text } = Typography;
const { Option } = Select;

const MatchPage: React.FC = () => {
  const { userSession } = useAuth();
  const [topic, setTopic] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<
    (typeof DIFFICULTY_ORDER)[number] | undefined
  >(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<MatchWebSocketMessage>("ws://localhost:8080/match", {
      onOpen: () => console.log("WebSocket connected"),
      onClose: () => console.log("WebSocket closed"),
      shouldReconnect: () => true,
    });

  const handleFindMatch = () => {
    if (!userSession?.id) {
      return message.error("User not logged in");
    }

    if (!isWebSocketConnected(readyState)) {
      return message.warning("WebSocket not connected");
    }

    const payload = createStartMatchPayload({
      userId: userSession.id,
      topic: topic!,
      difficulty: difficulty!,
    });

    sendJsonMessage(payload);
    setIsMatching(true);
    setCountdown(30);
    setMatchedUser(null);
  };

  const handleCancelMatch = () => {
    if (!userSession?.id) return;
    sendJsonMessage({ type: "CANCEL_MATCH", userId: userSession.id });
    setIsMatching(false);
    setCountdown(null);
  };

  // Countdown effect
  useEffect(() => {
    if (!isMatching || countdown === null) return;

    if (countdown <= 0) {
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMatching, countdown]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    handleMatchMessage({
      message: lastJsonMessage,
      onMatched: (userId) => {
        setMatchedUser(userId);
        message.success(`Match found with ${userId}`);
        setIsMatching(false);
        setCountdown(null);
      },
      onTimeout: (msg) => {
        message.warning(msg || "Match timeout");
        setIsMatching(false);
        setCountdown(null);
      },
      onCancelled: () => {
        message.info("Matchmaking successfully cancelled");
        setIsMatching(false);
        setCountdown(null);
      },
    });
  }, [lastJsonMessage]);

  // Fetch question categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchQuestionCategories();
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        message.error("Failed to load topics.");
      }
    };

    loadCategories();
  }, []);

  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1920&auto=format&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: 24,
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ paddingBottom: 16 }}>
          Start a Match
        </Title>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Select
            value={topic}
            onChange={setTopic}
            placeholder="Select question topic"
            disabled={isMatching}
            style={{ width: "100%" }}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>

          <Select
            value={difficulty}
            onChange={setDifficulty}
            placeholder="Select question difficulty"
            disabled={isMatching}
            style={{ width: "100%" }}
          >
            {DIFFICULTY_ORDER.map((level) => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>

          {!isMatching ? (
            <Button
              type="primary"
              size="large"
              block
              onClick={handleFindMatch}
              disabled={!userSession || !topic || !difficulty}
            >
              Find Match
            </Button>
          ) : (
            <Button
              danger
              type="default"
              size="large"
              block
              onClick={handleCancelMatch}
            >
              Cancel Match ({countdown}s)
            </Button>
          )}

          {matchedUser && (
            <Text type="success">✅ Matched with: {matchedUser}</Text>
          )}

          <Text type="secondary">
            Connection status: {ReadyState[readyState]}
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default MatchPage;
