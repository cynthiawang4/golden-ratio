import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ThanksChoices.module.css";
import { IconButton } from "@mui/material";
import CheckIcon from "../../images/check.svg?react";
import { Button, Typography } from "@mui/material";
import Back from "../../images/back.svg?react";
import { supabase, auth } from "../../lib/supabaseClient";

interface ThanksChoicesPageProps {
  roomId?: string;
  mode?: string;
  title?: string;
  isHost?: boolean;
  onStartVote?: () => void;
}

export default function ThanksChoicesPage({
  roomId,
  mode,
  title,
  isHost,
  onStartVote,
}: ThanksChoicesPageProps) {
  const navigate = useNavigate();

  const handleOnBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.thanksChoicesContainer}>
      <div className={styles.titleWrapper}>
        <IconButton onClick={handleOnBack} className={styles.backButton}>
          <Back />
        </IconButton>
      </div>

      <CheckIcon className={styles.check} />

      <div className={styles.contentContainer}>
        <h2 className={styles.pollCreated}>Choices Submitted!</h2>
        <h3 className={styles.topic}>Topic: {title ?? "Untitled"}</h3>

        {isHost && (
          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#999" }}>
            Press the button below when you're ready to begin.
          </p>
        )}

        {isHost ? (
          <div className={styles.startButtonContainer}>
            <Button variant="contained" onClick={onStartVote}>
              Start Ranking
            </Button>
          </div>
        ) : (
          <p className={styles.waitingMessage}>
            You will be able to vote once the host starts the process.
            <br />
            <strong>Come back after host confirmation!</strong>
          </p>
        )}
      </div>
    </div>
  );
}
