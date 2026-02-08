import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RoomPage.module.css";
import { Typography } from "@mui/material";
import LoadingPage from "../../components/Loading";

type RoomState = "choice" | "rank";

// TODO: Implement redirection based on "everyone" or "only me" choice
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

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.roomPageContainer}>
      <Typography>Oops not supposed to see this page </Typography>
    </div>
  );
}
