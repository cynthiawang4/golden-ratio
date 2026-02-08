import { Button, Typography, IconButton } from "@mui/material";
import { useEffect } from "react";
import styles from "../results/ResultsPage.module.css";
import Spiral from "../../images/spiral.svg?react";
import ArrowRight from "../../images/arrow-right.svg?react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface RevealPageProps {
  roomId?: string;
  onReveal: () => void;
}

export default function RevealPage({ roomId, onReveal }: RevealPageProps) {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div className={styles.revealContainer}>
      <Typography className={styles.subtitle}>The votes are in...</Typography>
      <div className={styles.revealWrapper}>
        <Spiral className={styles.spiral} />
        <div className={styles.revealButtonWrapper}>
          <Typography className={styles.title}>REVEAL RESULTS</Typography>
          <IconButton className={styles.revealButton} onClick={onReveal}>
            <ArrowRight />
          </IconButton>
        </div>
      </div>
      <Button variant="primary" onClick={handleExit} style={{ marginTop: "20px" }}>
        Exit
      </Button>
    </div>
  );
}
