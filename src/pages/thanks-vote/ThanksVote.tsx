import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, IconButton } from "@mui/material";
import styles from "../results/ResultsPage.module.css";
import thanksStyles from "./ThanksVote.module.css";

import Spiral from "../../images/spiral.svg?react";
import ArrowRight from "../../images/arrow-right.svg?react";
import CheckIcon from "../../images/check.svg?react";
import Back from "../../images/back.svg?react";

import { supabase } from "../../lib/supabaseClient";

interface ThanksVotePageProps {
  roomId: string;
  poll: any;
  isHost: boolean;
  onReveal: () => void;
}

export default function ThanksVotePage({
  roomId,
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
      <div className={styles.revealContainer}>

        <Typography className={styles.subtitle}>
          The votes are in...
        </Typography>

        <div className={styles.revealWrapper}>
          <Spiral className={styles.spiral} />
          <div className={styles.revealButtonWrapper}>
            <Typography className={styles.title}>
              REVEAL RESULTS
            </Typography>
            <IconButton
              className={styles.revealButton}
              onClick={handleReveal}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleExit}
          style={{ marginTop: 20 }}
        >
          Exit
        </Button>
      </div>
    );
  }

  /* ===========================
     GUEST VIEW — THANK YOU
     =========================== */
  return (
    <div className={thanksStyles.thanksVoteContainer}>
      <div className={thanksStyles.titleWrapper}>
        <IconButton onClick={handleExit} className={thanksStyles.backButton}>
          <Back />
        </IconButton>
      </div>

      <CheckIcon className={thanksStyles.check} />

      <div className={thanksStyles.contentContainer}>
        <Typography variant="h6">Thanks for voting!</Typography>

        <div className={thanksStyles.topic}>
          Topic: {topic || "—"}
        </div>

        <div className={thanksStyles.waitMessage}>
          Please wait while we tally the results...
          <br />
          Come back after host confirmation!
        </div>
      </div>
    </div>
  );
}
