import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Tag, Typography } from "antd";
import type { Question } from "../../types/Question";
import type { BaseUser, PeerUser } from "../../types/User";

const { Text, Title, Paragraph } = Typography;

export function CollaboratorPanel({
  currentUser,
  peers,
  question,
  onEndSession,
  isEndingSession,
}: {
  currentUser?: BaseUser;
  peers: PeerUser[];
  question?: Question;
  onEndSession: () => void;
  isEndingSession: boolean;
}) {
  return (
    <Flex vertical gap={16} style={{ marginBottom: 24 }}>
      <UserInfo currentUser={currentUser} />

      <CollaboratorList peers={peers} />

      {question && <QuestionSection question={question} />}

      <Button
        danger
        icon={<LogoutOutlined />}
        onClick={onEndSession}
        loading={isEndingSession}
        style={{ width: "100%", marginTop: "auto" }}
      >
        End Session
      </Button>
    </Flex>
  );
}

function UserInfo({ currentUser }: { currentUser?: BaseUser }) {
  return (
    <Flex align="center" gap={12}>
      <Avatar size="large" style={{ backgroundColor: "#1890ff" }}>
        {currentUser?.username?.charAt(0).toUpperCase()}
      </Avatar>
      <Flex vertical>
        <Text strong>You</Text>
        <Text type="secondary">Online</Text>
      </Flex>
    </Flex>
  );
}

function CollaboratorList({ peers }: { peers: PeerUser[] }) {
  return peers.length > 0 ? (
    <Flex vertical gap={8}>
      <Text type="secondary">Collaborator{peers.length > 1 ? "s" : ""}:</Text>
      {peers.map((peer) => (
        <Flex key={peer.id} align="center" gap={12}>
          <Avatar
            size="large"
            style={{
              backgroundColor:
                peer.color || peer.cursorColor || peer.userColor || "#1890ff",
            }}
          >
            {peer.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Flex vertical>
            <Text strong>{peer.name}</Text>
            <Text type="secondary">
              <StatusIndicator online={true} />
              Online
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  ) : (
    <Flex vertical gap={8}>
      <Text type="secondary">Collaborator Status:</Text>
      <Text type="secondary" italic>
        <StatusIndicator online={false} />
        Waiting for collaborator to join...
      </Text>
    </Flex>
  );
}

function StatusIndicator({ online }: { online: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: online ? "#52c41a" : "#f5222d",
        marginRight: 6,
      }}
    />
  );
}

function QuestionSection({ question }: { question: Question }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <Title level={4} style={{ marginBottom: 12 }}>
        {question.title}
      </Title>
      <Paragraph style={{ whiteSpace: "pre-wrap", marginBottom: 12 }}>
        {question.description}
      </Paragraph>
      <Flex gap={4}>
        <Tag color="blue">{question.complexity}</Tag>
        <Tag color="green">Python</Tag>
      </Flex>
      <Flex gap = {2}>
        {question.categories.map((category, index) => (
            <Tag key = {index} color="yellow">{category}</Tag>
        ))}
      </Flex>
    </div>
  );
}
