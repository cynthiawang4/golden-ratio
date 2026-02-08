import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ThanksVote.module.css";
import { IconButton } from "@mui/material";
import CheckIcon from "../../images/check.svg?react";
import Back from "../../images/back.svg?react";

export default function ThanksVotePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [topic, setTopic] = useState<string>("");

  //help me cynthia
  useEffect(() => {
    try {
      if (!roomId) return;
      // CYNTHIA TOPIC
      setTopic("TOPIC");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const handleOnBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.thanksVoteContainer}>
      <div className={styles.titleWrapper}>
        <IconButton onClick={handleOnBack} className={styles.backButton}>
          <Back />
        </IconButton>
      </div>
      <CheckIcon className={styles.check} />
      <div className={styles.contentContainer}>
        Thanks for voting
        <div className={styles.topic}>{topic}</div>
        <div className={styles.waitMessage}>
          Please wait while we tally the results...
          <br />
          Come back after host confirmation!
        </div>
      </div>
    </div>
  );
}
