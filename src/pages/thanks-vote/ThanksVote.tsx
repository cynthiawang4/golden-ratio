import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ThanksVote.module.css";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import CheckIcon from "../../images/check.svg?react";
import Back from "../../images/back.svg?react";


// CYNTHIA THIS IS TEMP IDK WHAT THE DB STATES ARE
type RoomState = "choice" | "rank";

// EVERYONE LANDS HERE BUT GETS REDIRECTED BASED ON ROOM STATE CYNTHIA
export default function ThanksVotePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

//help me cynthia
  useEffect(() => {
    try {
      if (!roomId) return;
      const roomState: RoomState = "choice";
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const handleOnBack = () => {};
  
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
        <div className={styles.topic}> 
            Topic
        </div>
        <div className={styles.waitMessage}>
            Please wait while we tally the results...
            <br/>
            Come back after host confirmation!
        </div>
    </div>
    
    </div>
  );
}
