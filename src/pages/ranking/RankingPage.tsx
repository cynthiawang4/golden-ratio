import { useParams } from "react-router-dom";
import styles from "./Ranking.module.css";
import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import StarIcon from "../../images/star.svg?react";
import LoadingPage from "../../components/Loading";
import { supabase } from "../../lib/supabaseClient";

interface RankingPageProps {
  roomId?: string;
  num_choices: number;
  isHost?: boolean;
  onDoneVote?: () => void;
}

export default function RankingPage({ roomId: propRoomId, num_choices, isHost, onDoneVote }: RankingPageProps) {
  const { roomId: paramRoomId } = useParams();
  const roomId = propRoomId || paramRoomId;
  const [loading, setLoading] = useState<boolean>(true);
  const [choices, setChoices] = useState<any[]>([]);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    if (!roomId) return;

    const fetchPollData = async () => {
      try {
        setLoading(true);

        // Fetch poll info
        const { data: pollData, error: pollError } = await supabase
          .from("polls")
          .select("title, status, mode")
          .eq("id", roomId)
          .single();

        if (pollError) throw pollError;

        setTopic(pollData?.title || "");

        // Fetch choices for this poll
        const { data: choicesData, error: choicesError } = await supabase
          .from("choices")
          .select("*")
          .eq("poll_id", roomId);

        if (choicesError) throw choicesError;

        setChoices(choicesData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [roomId]);

  // Submit rankings to database
  const handleNext = async () => {
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;
    if (!userId) return;

    const inserts = userChoices.map((choiceLabel, index) => {
      const choice = choices.find(c => c.label === choiceLabel);
      if (!choice) return null;
      return {
        poll_id: roomId,
        choice_id: choice.id,
        user_id: userId,
        rank: index + 1, // 1 = top rank, 2 = second, etc.
      };
    }).filter(Boolean);

    const { error } = await supabase.from('votes').insert(inserts);
    if (error) console.error(error);

    // After submission, move to rankingDone
    await supabase
      .from("polls")
      .update({ status: "rankingDone" })
      .eq("id", roomId);
  };

  const handleChoiceButton = (choiceText: string) => {
    setUserChoices((prev) => {
      // 1. If already ranked, remove it (standard toggle behavior)
      if (prev.includes(choiceText)) {
        return prev.filter((c) => c !== choiceText);
      }

      // 2. If we have space, just add it to the end
      if (prev.length < num_choices) {
        return [...prev, choiceText];
      }

      // 3. IF FULL: Replace the last selected item with the new one
      // .slice(0, -1) gets everything except the last element
      return [...prev.slice(0, -1), choiceText];
    });
  };

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.rankingPage}>
      <ButtonColumn />
      <div className={styles.rankingContainer}>
        <Stack spacing={0.2}>
          <Typography className={styles.title}>Topic: {topic}</Typography>
          <Typography className={styles.subtitle}>
            Choose {num_choices} choices
          </Typography>
        </Stack>
        <div className={styles.choiceContainer}>
          {choices.map((choice, i) => {
            const choiceText = choice.label;
            const userChoiceIndex = userChoices.findIndex((c) => c === choiceText);
            return (
              <ChoiceButton
                key={choice.id}
                onClick={() => handleChoiceButton(choiceText)}
                rank={userChoiceIndex !== -1 ? userChoiceIndex + 1 : undefined}
                text={choiceText}
              />
            );
          })}
        </div>
      </div>
      {isHost && (
        <ButtonColumn
          onNext={onDoneVote}
        />
      )}
      <Button
        onClick={handleNext}
        className={styles.choiceButton}
        variant="primary"
        disabled={userChoices.length !== num_choices}
      >
        Upload
      </Button>
    </div>
  );
}

type ChoiceButtonProps = {
  rank: number | undefined;
  onClick: () => void;
  text: string;
};

function ChoiceButton({ onClick, rank, text }: ChoiceButtonProps) {
  return (
    <Button
      className={`${styles.choiceButton} ${rank !== undefined ? styles.selected : ""}`}
      onClick={onClick}
    >
      {rank !== undefined && (
        <div className={styles.rankBadge}>
          <Typography>{rank}</Typography>
        </div>
      )}
      {text}
    </Button>
  );
}

type ButtonColumnProps = {
  onNext?: () => void;
  disabled?: boolean;
};

function ButtonColumn({ onNext, disabled }: ButtonColumnProps) {
  return (
    <div className={styles.buttonContainer}>
      <StarIcon className={`${onNext === undefined ? styles.hide : ""}`} />
      <Button
        variant="contained"
        onClick={onNext}
        disabled={disabled}
        className={`${onNext === undefined ? styles.hide : ""}`}
        aria-hidden={Boolean(onNext)}
      >
        Next
      </Button>
    </div>
  );
}
