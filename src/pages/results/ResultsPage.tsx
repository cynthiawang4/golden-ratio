import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";
import LoadingPage from "../../components/Loading";
import styles from "./ResultsPage.module.css";
import Logo from "../../components/Logo";
import { Button, IconButton, Typography } from "@mui/material";
import GoldStar from "../../images/gold-star.svg?react";
import SilverStar from "../../images/silver-star.svg?react";
import BronzeStar from "../../images/bronze-star.svg?react";
import useGoldenMusic from "./MusicPlayer";
import Spiral from "../../images/spiral.svg?react";
import ArrowRight from "../../images/arrow-right.svg?react";

const FAKE_DATA = [
  {
    id: "0",
    label: "Noodles",
    score: 50,
  },
  {
    id: "1",
    label: "Apples",
    score: 250,
  },
  {
    id: "2",
    label: "Banana",
    score: 352523,
  },
  {
    id: "3",
    label: "Chocolate",
    score: 25,
  },
];

export default function ResultsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<
    Array<{ id: string; label: string; score: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [startAudio, setStartAudio] = useState<boolean>(false);
  const { audio, play } = useGoldenMusic();

  useEffect(() => {
    if (!roomId) return;

    (async () => {
      try {
        setLoading(true);
        const { data: userData } = await auth.getUser();
        setUser((userData as any)?.user ?? null);

        // fetch choices and aggregate scores
        const { data: choices } = await supabase
          .from("choices")
          .select("id, label")
          .eq("poll_id", roomId);
        const list = (choices as any) || [];
        const computed = [] as any[];
        for (const c of list) {
          const { data: votes } = await supabase
            .from("votes")
            .select("score")
            .eq("choice_id", c.id);
          const total = ((votes as any[]) || []).reduce(
            (acc, v) => acc + (v.score || 0),
            0,
          );
          computed.push({ id: c.id, label: c.label, score: total });
        }
        computed.sort((a, b) => b.score - a.score);
        //setResults(computed);
        // CYNTHIA REMOVE WHEN DONE
        setResults(FAKE_DATA);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);

  // if (!user) {
  //   return <div>No User</div>;
  // }

  const handleExit = () => {
    navigate("/");
  };

  const topThree = [results?.[1], results?.[0], results?.[2]];

  if (!roomId) return <div>No poll specified</div>;

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.resultsPage}>
      <div className={styles.topBar}>
        <Logo />
        {audio}
        {startAudio && (
          <Button variant="primary" onClick={handleExit}>
            Exit
          </Button>
        )}
      </div>
      {startAudio ? (
        <div className={styles.podiumWrapper}>
          {topThree.map((r, i) => {
            if (!r) return <div key={i} className={styles.emptySpace} />;

            // Map the array index back to the actual rank
            // results[0] is index 1 in topThree -> Rank 1
            // results[1] is index 0 in topThree -> Rank 2
            // results[2] is index 2 in topThree -> Rank 3
            const rank =
              r.id === results[0]?.id
                ? "1"
                : r.id === results[1]?.id
                  ? "2"
                  : "3";

            return <Podium key={r.id} rank={rank} text={r.label} />;
          })}
        </div>
      ) : (
        <RevealContainer
          onReveal={() => {
            play();
            setStartAudio(true);
          }}
        />
      )}
    </div>
  );
}

type RevealContainerProps = {
  onReveal: () => void;
};

function RevealContainer({ onReveal }: RevealContainerProps) {
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
    </div>
  );
}

type PodiumProps = {
  rank: "1" | "2" | "3";
  text: string;
};

function Podium({ rank, text }: PodiumProps) {
  const star =
    rank === "1" ? (
      <GoldStar />
    ) : rank === "2" ? (
      <SilverStar />
    ) : (
      <BronzeStar />
    );

  const rankText = rank === "1" ? "1st" : rank === "2" ? "2nd" : "3rd";

  return (
    <div className={styles.podiumContainer} data-rank={rank}>
      {star}
      <div className={styles.podiumStand}>
        <Typography className={styles.rank}>{rankText}</Typography>
        <Typography className={styles.choice}>{text}</Typography>
      </div>
    </div>
  );
}
