import { Alert, App, Flex, Layout, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { CollaboratorPanel } from "~/components/collabs/CollaboratorPanel";
import { EditorPanel } from "~/components/collabs/EditorPanel";
import type { Question } from "~/types/Question";
import type { BaseUser } from "~/types/User";
import { useAuth } from "../contexts/AuthContext";
import { useCollabSession } from "../hooks/useCollabSession"; // adjust path if needed
import { fetchQuestionById } from "../services/question-services";
import { getUserById } from "../services/user-services";

type LocationState = {
  matchedUserId: string;
  questionId: string;
};

export default function CollabContent() {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state } = useLocation();
  const { matchedUserId, questionId } = (state || {}) as LocationState;
  const { jwtPayload } = useAuth();

  const [currentUser, setCurrentUser] = useState<BaseUser>();
  const [question, setQuestion] = useState<Question>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!editorContainerRef.current) return;

    if (!isFullscreen) {
      editorContainerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Fetch current user
  useEffect(() => {
    if (!jwtPayload?.id) return;

    getUserById(jwtPayload.id)
      .then((res) => {
        if (res.success && res.data) {
          setCurrentUser(res.data);
        } else {
          console.error("Failed to fetch current user:", res.message);
          setError("Unable to load user information.");
        }
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setError("An error occurred while loading user data.");
      });
  }, [jwtPayload]);

  // Fetch question
  useEffect(() => {
    if (!questionId) return;

    fetchQuestionById(questionId)
      .then((result) => {
        if (result.success && result.data) {
          setQuestion(result.data);
        } else {
          setError(result.message || "Unable to load question data.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch question:", err);
        setError("Unable to load question data.");
      });
  }, [questionId]);

  // Yjs + CodeMirror Init
  const { yTextRef, providerRef, peers, error, setError } = useCollabSession({
    sessionId,
    currentUser,
  });

  const handleEndSession = () => {
    modal.confirm({
      title: "End Collaboration Session",
      content:
        "Are you sure you want to end this session? All collaborators will be disconnected.",
      okText: "End Session",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        setIsEndingSession(true);
        providerRef.current?.destroy();
        setTimeout(() => navigate("/match"), 1000);
      },
    });
  };

  const isNotReady =
    !sessionId || !matchedUserId || !yTextRef.current || !providerRef.current;

  if (error || isNotReady) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        gap={64}
        style={{ minHeight: "80vh" }}
      >
        <Alert
          style={{ maxWidth: 480 }}
          message={error ? "Error" : "Initializing Session"}
          description={
            error
              ? error
              : "Please wait while we connect you to the collaborative editor and load the question data."
          }
          type={error ? "error" : "info"}
          showIcon
          closable={!!error}
          onClose={error ? () => setError(null) : undefined}
        />
        {!error && <Spin size="large" />}
      </Flex>
    );
  }

  return (
    <Layout hasSider style={{ minHeight: "80vh", position: "relative" }}>
      <div
        style={{
          width: 320,
          background: "#f5f5f5",
          borderRight: "1px solid #eee",
          height: "100%",
          padding: "12px",
          position: "absolute",
          overflow: "auto",
        }}
      >
        <CollaboratorPanel
          currentUser={currentUser}
          peers={peers}
          question={question}
          onEndSession={handleEndSession}
          isEndingSession={isEndingSession}
        />
      </div>

      {!isNotReady && (
        <EditorPanel
          isFullscreen={isFullscreen}
          yTextRef={yTextRef}
          providerRef={providerRef}
          editorContainerRef={editorContainerRef}
          toggleFullscreen={toggleFullscreen}
        />
      )}
    </Layout>
  );
}
