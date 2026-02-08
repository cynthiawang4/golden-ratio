import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, IconButton } from "@mui/material";
import styles from "./ThanksVote.module.css";

import Spiral from "../../images/spiral.svg?react";
import ArrowRight from "../../images/arrow-right.svg?react";
import CheckIcon from "../../images/check.svg?react";
import Back from "../../images/back.svg?react";

interface ThanksVotePageProps {
  poll: any;
  isHost: boolean;
  onReveal: () => void;
}

export default function ThanksVotePage({
  poll,
  isHost,
  onReveal,
}: ThanksVotePageProps) {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    if (poll?.title) {
      setTopic(poll.title);
    }
  }, [poll]);

  const handleExit = () => {
    navigate("/");
  };

  const handleReveal = async () => {
    onReveal();
  };

  /* ===========================
     HOST VIEW — REVEAL
     =========================== */
  if (isHost) {
    return (
      <div className={styles.revealPage}>
        <div className={styles.revealContainer}>
          <Typography className={styles.subtitle}>The votes are in...</Typography>

          <div className={styles.revealWrapper}>
            <Spiral className={styles.spiral} />
            <div className={styles.revealButtonWrapper}>
              <Typography className={styles.title}>REVEAL RESULTS</Typography>
              <IconButton className={styles.revealButton} onClick={handleReveal}>
                <ArrowRight />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===========================
     GUEST VIEW — THANK YOU
     =========================== */
  return (
    <div className={styles.thanksVoteContainer}>
      <div className={styles.titleWrapper}>
        <IconButton onClick={handleExit} className={styles.backButton}>
          <Back />
        </IconButton>
      </div>

      <CheckIcon className={styles.check} />

      <div className={styles.contentContainer}>
        <Typography variant="h6">Thanks for voting!</Typography>

        <div className={styles.topic}>Topic: {topic || "—"}</div>

        <div className={styles.waitMessage}>
          Please wait while we tally the results...
          <br />
          Come back after host confirmation!
        </div>
      </div>
    </div>
  );
}
