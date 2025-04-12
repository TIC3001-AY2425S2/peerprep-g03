import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";
import { Button, Layout, Tooltip } from "antd";
import { yCollab } from "y-codemirror.next";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
const { Content } = Layout;

export function EditorPanel({
  isFullscreen,
  yTextRef,
  providerRef,
  editorContainerRef,
  toggleFullscreen,
}: {
  isFullscreen: boolean;
  yTextRef: React.RefObject<Y.Text | null>;
  providerRef: React.RefObject<WebsocketProvider | null>;
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  toggleFullscreen: () => void;
}) {
  const extensions = [
    python(),
    ...(yTextRef.current && providerRef.current
      ? [yCollab(yTextRef.current, providerRef.current.awareness)]
      : []),
  ];

  return (
    <Content
      style={{
        marginLeft: 360,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={editorContainerRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CodeMirror
          height={isFullscreen ? "100vh" : "80vh"}
          theme={dracula}
          extensions={extensions}
          basicSetup={{ lineNumbers: true }}
        />
        <FullscreenButton
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
    </Content>
  );
}

function FullscreenButton({
  isFullscreen,
  toggleFullscreen,
}: {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) {
  return (
    <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
      <Button
        type="text"
        icon={
          isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
        }
        onClick={toggleFullscreen}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 100,
          color: "white",
          padding: 12,
          backgroundColor: "rgba(117, 117, 117, 0.85)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      />
    </Tooltip>
  );
}
