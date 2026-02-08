import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import LoadingPage from "../../components/Loading";
import styles from "./ResultsPage.module.css";
import Logo from "../../components/Logo";
import Podium from "./Podium";
import { Button } from "@mui/material";
import useGoldenMusic from "./MusicPlayer";

interface ResultsPageProps {
  roomId?: string;
}

type Result = {
  id: string;
  label: string;
  score: number;
};

export default function ResultsPage({ roomId: propRoomId }: ResultsPageProps) {
  const { roomId: paramRoomId } = useParams();
  const roomId = propRoomId || paramRoomId;
  const navigate = useNavigate();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const { audio, play } = useGoldenMusic();

  const podiumOrder = [
    results[1], // 2nd
    results[0], // 1st
    results[2], // 3rd
  ].filter((p): p is Result => !!p);

  useEffect(() => {
    if (!roomId) return;

    (async () => {
      try {
        setLoading(true);

        const { data: choices } = await supabase
          .from("choices")
          .select("id, label")
          .eq("poll_id", roomId);

        const { data: votes } = await supabase
          .from("votes")
          .select("choice_id, rank")
          .eq("poll_id", roomId);

        if (!choices || !votes) return;

        const computed = choices.map((c) => {
          const choiceVotes = votes.filter((v) => v.choice_id === c.id);

          if (choiceVotes.length === 0) {
            return {
              id: c.id,
              label: c.label,
              score: Infinity, // push unvoted choices to the bottom
            };
          }

          const score =
            choiceVotes.reduce((sum, v) => sum + v.rank, 0) /
            choiceVotes.length;

          return {
            id: c.id,
            label: c.label,
            score: score,
          };
        });

        computed.sort((a, b) => a.score - b.score);

        const topThree = computed.slice(0, 3);
        setResults(topThree);

        play();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

  if (loading) return <LoadingPage />;
  if (!roomId) return <div>No poll specified</div>;

  return (
    <div className={styles.resultsPage}>
      <div className={styles.topBar}>
        <Logo />
        {audio}
        <Button variant="primary" onClick={() => navigate("/")}>
          Exit
        </Button>
      </div>

      <div className={styles.podiumWrapper}>
        {podiumOrder.map((r, i) => {
          const rank = i === 1 ? "1" : i === 0 ? "2" : "3";

          return <Podium key={r.id} rank={rank} text={r.label} />;
        })}
      </div>
    </div>
  );
}
