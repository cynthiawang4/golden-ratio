import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SharePage.module.css";
import CheckIcon from "../../images/check.svg?react";
import CopyIcon from "../../images/copy.svg?react";
import { useState } from "react";

export default function SharePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, roomId, mode } = (location.state as any) || {};
  const [copied, setCopied] = useState(false);

  // Determine share link based on mode
  // "onlyMe": guests see rankings; "everyone": guests go to choice page
  const shareLink = mode === "onlyMe" 
    ? `${window.location.origin}/results/${roomId ?? ""}`
    : `${window.location.origin}/choice/${roomId ?? ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const handleNext = () => {
    navigate(`/choice/${roomId ?? ""}`);
  };

  return (
    <div className={styles.confirmationContainer}>
      <CheckIcon className={styles.check} />
      <h2 className={styles.pollCreated}>Poll Created</h2>
      <h3 className={styles.topic}>Topic: {topic ?? "Untitled"}</h3>

      <div className={styles.shareRow}>
        <button className={styles.shareButton} onClick={handleCopy}>
          <CopyIcon />
          <span>Share link</span>
        </button>
        {copied && <span className={styles.copied}>Copied!</span>}
      </div>

      <div className={styles.nextRow}>
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
