import { useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { COLLAB_SVC_WS_URL } from "~/config";
import type { BaseUser, PeerUser } from "~/types/User";

type UseCollabSessionProps = {
  sessionId?: string;
  currentUser?: BaseUser;
};

export function useCollabSession({
  sessionId,
  currentUser,
}: UseCollabSessionProps) {
  const [peers, setPeers] = useState<PeerUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ydocRef = useRef<Y.Doc | null>(null);
  const yTextRef = useRef<Y.Text | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!sessionId || !currentUser) return;
    if (hasInitialized.current) return;

    try {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        COLLAB_SVC_WS_URL,
        sessionId,
        ydoc
      );
      const yText = ydoc.getText("codemirror");

      ydocRef.current = ydoc;
      yTextRef.current = yText;
      providerRef.current = provider;
      hasInitialized.current = true;

      provider.awareness.setLocalStateField("user", {
        id: currentUser.id,
        name: currentUser.username,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        cursorColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });

      const updatePeers = () => {
        const states = Array.from(provider.awareness.getStates().values());
        const users = states
          .map((s) => s.user)
          .filter(Boolean)
          .filter((user) => user.id !== currentUser.id);
        setPeers(users);
      };

      provider.awareness.on("change", updatePeers);
      provider.on("status", ({ status }) => {
        console.log("Yjs provider status:", status);
        if (status === "connected") updatePeers();
      });

      return () => {
        console.log("Cleaning up Yjs...");
        provider.disconnect();
        provider.destroy();
        ydoc.destroy();

        ydocRef.current = null;
        yTextRef.current = null;
        providerRef.current = null;
        hasInitialized.current = false;
      };
    } catch (err) {
      console.error("Yjs init error", err);
      setError("Failed to initialize collaboration.");
    }
  }, [sessionId, currentUser?.id]);

  return {
    ydocRef,
    yTextRef,
    providerRef,
    peers,
    error,
    setError,
  };
}
