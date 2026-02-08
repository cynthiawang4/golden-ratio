import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RoomPage.module.css";
import { Typography, CircularProgress, Button } from "@mui/material";
import { supabase, auth } from "../../lib/supabaseClient";
import SharePage from "../share/SharePage";
import CreateChoicePage from "../choice/CreateChoicePage";
import ThanksChoicesPage from "../thanks-choices/ThanksChoices";
import RankingPage from "../ranking/RankingPage";
import RevealPage from "../reveal/RevealPage";
import ResultsPage from "../results/ResultsPage";

type PollStatus =
  | "setup"
  | "collecting"
  | "collectingDone"
  | "ranking"
  | "rankingDone"
  | "revealed";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [poll, setPoll] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: userData } = await auth.getUser();
        const currentUser = (userData as any)?.user ?? null;
        setUser(currentUser);

        // Fetch poll
        const { data: pollData, error } = await supabase
          .from("polls")
          .select("*")
          .eq("id", roomId)
          .single();

        if (error || !pollData) {
          navigate("/");
          return;
        }

        setPoll(pollData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, navigate]);

  const updatePollStatus = async (newStatus: PollStatus) => {
    if (!poll || user?.id !== poll.owner_id) return;

    try {
      const { error } = await supabase
        .from("polls")
        .update({ status: newStatus })
        .eq("id", poll.id);

      if (error) throw error;

      setPoll({ ...poll, status: newStatus });
    } catch (e) {
      console.error("Failed to update poll status", e);
    }
  };

  const handleReveal = () => {
    // Once the host clicks the reveal button, update poll status to revealed
    updatePollStatus("revealed");
    setIsRevealing(true); // Change to revealing state
  };

  if (loading) return <CircularProgress />;
  if (!poll) return <Typography>Poll not found</Typography>;

  const isHost = user?.id === poll.owner_id;

  // ---------------- Render appropriate page ----------------
  const renderPage = () => {
    switch (poll.status as PollStatus) {
      case "setup":
        return (
          <SharePage 
            roomId={roomId} 
            mode={poll.mode} 
            title={poll.title} 
            isHost={isHost} 
            onStartChoices={() => updatePollStatus("collecting")} 
          />
        );
      case "collecting":
        return <CreateChoicePage roomId={roomId} poll={poll} isHost={isHost} onDoneChoices={() => updatePollStatus("collectingDone")}/>;
      case "collectingDone":
        return (
          <ThanksChoicesPage 
            roomId={roomId} 
            mode={poll.mode} 
            title={poll.title} 
            isHost={isHost} 
            onStartVote={() => updatePollStatus("ranking")} 
          />
        );
      case "ranking":
        return <RankingPage roomId={roomId} num_choices={poll.num_choices} isHost={isHost} onDoneVote={() => updatePollStatus("rankingDone")} />;
      case "rankingDone":
        return <RevealPage roomId={roomId} onReveal={handleReveal} />;
      case "revealed":
        return <ResultsPage roomId={roomId} />;
      default:
        return <Typography>Unknown poll status</Typography>;
    }
  };

  // ---------------- Host-only control buttons ----------------
  const renderHostControls = () => {
    if (!isHost) return null;

    switch (poll.status as PollStatus) {
      case "rankingDone":
        return (
          <Button
            variant="contained"
            onClick={() => updatePollStatus("revealed")}
            style={{ marginTop: 20 }}
          >
            Reveal Results
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.roomContainer}>
      {renderPage()}
      {renderHostControls()}
    </div>
  );
}
