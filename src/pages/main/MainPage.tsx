import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";
import { Button, Typography } from "@mui/material";

export default function MainPage() {
  const navigate = useNavigate();

  const handleHostButton = () => {
    navigate("/host");
  };

  const handleJoinButton = () => {
    navigate("/join");
  };

  return (
    <div className={styles.mainContainer}>
      <Typography className={styles.title}>Golden Ratio</Typography>
      <div className={styles.buttonContainer}>
        <Button variant="secondary" onClick={handleHostButton}>
          Host
        </Button>
        <Button variant="secondary" onClick={handleJoinButton}>
          Join
        </Button>
      </div>
    </div>
  );
}
