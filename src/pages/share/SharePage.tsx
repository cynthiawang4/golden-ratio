import { useState } from "react";
import styles from "./SharePage.module.css";
import CheckIcon from "../../images/check.svg?react";
import CopyIcon from "../../images/copy.svg?react";
import { Button, Typography } from "@mui/material";

interface SharePageProps {
  roomId?: string;
  mode?: string;
  title?: string;
  isHost?: boolean;
  onStartChoices?: () => void;
}

export default function SharePage({
  roomId,
  mode,
  title,
  isHost,
  onStartChoices,
}: SharePageProps) {
  const [copied, setCopied] = useState(false);

  // Share link always goes to /room/:roomId; RoomPage handles redirecting guests based on status
  const shareLink = `${window.location.origin}/room/${roomId ?? ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  return (
    <div className={styles.confirmationContainer}>
      <CheckIcon className={styles.check} />
      <h2 className={styles.pollCreated}>Poll Created!</h2>
      <h3 className={styles.topic}>Topic: {title ?? "Untitled"}</h3>

      <p className={styles.instructions}>
        Share this link with participants to let them join the poll. They will be redirected
        to the room once they open it.
      </p>

      <div className={styles.shareRow}>
        <button className={styles.shareButton} onClick={handleCopy}>
          <CopyIcon />
          <span>Share link</span>
        </button>
        {copied && <span className={styles.copied}>Copied!</span>}
      </div>

      {isHost && (
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#999" }}>
          Press the button below when you're ready to begin.
        </p>
      )}

      {isHost && mode === "everyone" && (
        <div className={styles.startButtonContainer}>
          <Button variant="contained" onClick={onStartChoices}>
            Start Adding Choices
          </Button>
        </div>
      )}

      {isHost && mode === "onlyMe" && (
        <div className={styles.startButtonContainer}>
          <Button variant="contained" onClick={onStartChoices}>
            Start Ranking
          </Button>
        </div>
      )}

      {!isHost && (
        <p className={styles.waitingMessage}>
          You will be able to suggest choices once the host starts the process.
        </p>
      )}
    </div>
  );
}
