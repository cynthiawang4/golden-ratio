import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RoomPage.module.css";
import { CircularProgress, Typography } from "@mui/material";
import LoadingPage from "../../components/Loading";
import { supabase } from "../../lib/supabaseClient";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!roomId) return;

    (async () => {
      const { data: poll } = await supabase
        .from("polls")
        .select("mode, status")
        .eq("id", roomId)
        .single();

      if (!poll) return;

      if (poll.status === 'setup') {
        poll.mode === 'everyone'
          ? navigate(`/share/${roomId}`)
          : navigate(`/choice/${roomId}`)
      }

      if (poll.status === 'collecting') {
        navigate(`/choice/${roomId}`)
      }

      if (poll.status === 'ranking') {
        navigate(`/ranking/${roomId}`)
      }

      if (poll.status === 'revealed') {
        navigate(`/results/${roomId}`)
      }
    })();
  }, [roomId]);

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.roomPageContainer}>
      <Typography>Oops not supposed to see this page </Typography>
    </div>
  );
}
