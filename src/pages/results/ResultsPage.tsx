import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";
import LoadingPage from "../../components/Loading";
import styles from "./ResultsPage.module.css";
import Logo from "../../components/Logo";
import Podium from "./Podium";
import { Button } from "@mui/material";
import useGoldenMusic from "./MusicPlayer";
import RevealPage from "../reveal/RevealPage";

interface ResultsPageProps {
  roomId?: string;
}

export default function ResultsPage({ roomId: propRoomId }: ResultsPageProps) {
  const { roomId: paramRoomId } = useParams();
  const roomId = propRoomId || paramRoomId;
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<Array<{ id: string; label: string; score: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [startAudio, setStartAudio] = useState(false);
  const { audio, play } = useGoldenMusic();

  useEffect(() => {
    if (!roomId) return;

    (async () => {
      try {
        setLoading(true);
        const { data: userData } = await auth.getUser();
        setUser((userData as any)?.user ?? null);

        const { data: choicesData, error: choicesError } = await supabase
          .from("choices")
          .select("id, label")
          .eq("poll_id", roomId);

        if (choicesError) throw choicesError;
        if (!choicesData) throw new Error("No choices found");

        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("choice_id, rank")
          .eq("poll_id", roomId);

        if (votesError) throw votesError;

        const computed = choicesData.map((c) => {
          const choiceVotes = votesData.filter((v) => v.choice_id === c.id);
          const score = choiceVotes.reduce(
            (acc, v) => acc + (choicesData.length - v.rank + 1),
            0
          );
          return { id: c.id, label: c.label, score };
        });

        computed.sort((a, b) => b.score - a.score);

        setResults(computed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

  const handleRevealResults = () => {
    play();
    setStartAudio(true);
  };

  const handleExit = () => {
    navigate("/"); // Redirect to home
  };

  if (loading) return <LoadingPage />;
  if (!roomId) return <div>No poll specified</div>;

  return (
    <div className={styles.resultsPage}>
      <div className={styles.topBar}>
        <Logo />
        {audio}
        <Button variant="primary" onClick={handleExit}>
          Exit
        </Button>
      </div>

      {startAudio ? (
        <div className={styles.podiumWrapper}>
          {results?.map((r, i) => {
            const rank = i === 0 ? "1" : i === 1 ? "2" : "3";
            return <Podium key={r.id} rank={rank} text={r.label} />;
          })}
        </div>
      ) : (
        <RevealPage roomId={roomId} onReveal={handleRevealResults} />
      )}
    </div>
  );
}
