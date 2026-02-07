import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RoomPage.module.css";
import { CircularProgress, Typography } from "@mui/material";

// CYNTHIA THIS IS TEMP IDK WHAT THE DB STATES ARE
type RoomState = "choice" | "rank";

// EVERYONE LANDS HERE BUT GETS REDIRECTED BASED ON ROOM STATE CYNTHIA
export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (!roomId) return;
      const roomState: RoomState = "choice";

      if (roomState === "choice") {
        navigate(`/choice/${roomId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  return (
    <div className={styles.roomPageContainer}>
      {loading && <CircularProgress />}{" "}
      {!loading && <Typography>Oops not supposed to see this page </Typography>}
    </div>
  );
}
