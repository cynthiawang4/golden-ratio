import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ConfirmationPage.module.css";
import CheckIcon from "../../images/check.svg?react";
import CopyIcon from "../../images/copy.svg?react";
import { useState } from "react";

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, roomId } = (location.state as any) || {};
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/choice/${roomId ?? ""}`;

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
