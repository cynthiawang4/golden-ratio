import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SharePage.module.css";
import CheckIcon from "../../images/check.svg?react";
import CopyIcon from "../../images/copy.svg?react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import LoadingPage from "../../components/Loading";

export default function SharePage() {
  const { roomId } = useParams()
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [poll, setPoll] = useState<any>(null)

  useEffect(() => {
    if (!roomId) return
    supabase.from('polls').select('*').eq('id', roomId).single()
      .then(({ data }) => setPoll(data))
  }, [roomId])

  if (!poll) return <LoadingPage />

  // Determine share link based on mode
  // "onlyMe": guests go to ranking; "everyone": guests go to choice page
  const link =
    poll.mode === 'everyone'
      ? `${location.origin}/choice/${roomId}`
      : `${location.origin}/results/${roomId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const handleNext = () => {
    navigate(
      poll.mode === 'everyone'
        ? `/choice/${roomId}`
        : `/ranking/${roomId}`
    )
  };

  return (
    <div className={styles.confirmationContainer}>
      <CheckIcon className={styles.check} />
      <h2 className={styles.pollCreated}>Poll Created</h2>
      <h3 className={styles.topic}>Topic: {poll.title ?? "Untitled"}</h3>

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
