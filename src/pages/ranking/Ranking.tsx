import { useParams } from "react-router-dom";
import styles from "./Ranking.module.css";
import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import StarIcon from "../../images/star.svg?react";
import LoadingPage from "../../components/Loading";

export default function RankingPage() {
  const { roomId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [choices, setChoices] = useState<string[]>([]);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [numChoicesToChoose, setNumChoicesToChoose] = useState<number>(
    choices.length,
  );

  // CYNTHIA GET CHOICES FROM DB DO YOU FILTER
  useEffect(() => {
    if (!roomId) return;
    try {
      setLoading(true);
      const choices = ["Applies", "Banana", "Carrot", "Donut", "Elephant"];
      setChoices(choices);
      setTopic("What to eat?");

      let choicesToChoose = 2;
      // Validate choices
      if (choices.length < choicesToChoose) {
        choicesToChoose = choices.length;
      }
      setNumChoicesToChoose(choicesToChoose);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // CYNTHIA DB TO DO SUBMIT RANKINGS
  const handleNext = () => {};

  const handleChoiceButton = (choiceText: string) => {
    setUserChoices((prev) => {
      // 1. If already ranked, remove it (standard toggle behavior)
      if (prev.includes(choiceText)) {
        return prev.filter((c) => c !== choiceText);
      }

      // 2. If we have space, just add it to the end
      if (prev.length < numChoicesToChoose) {
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
            Choose {numChoicesToChoose} choices
          </Typography>
        </Stack>
        <div className={styles.choiceContainer}>
          {choices.map((choice, i) => {
            const userChoiceIndex = userChoices.findIndex((c) => choice === c);
            return (
              <ChoiceButton
                key={i}
                onClick={() => handleChoiceButton(choice)}
                rank={userChoiceIndex !== -1 ? userChoiceIndex + 1 : undefined}
                text={choice}
              />
            );
          })}
        </div>
      </div>
      <ButtonColumn
        onNext={handleNext}
        disabled={userChoices.length !== numChoicesToChoose}
      />
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
      <StarIcon style={{ opacity: onNext ? "1" : "0" }} />
      <Button
        variant="primary"
        onClick={onNext}
        disabled={disabled}
        style={{
          opacity: onNext ? "1" : "0",
          pointerEvents: onNext ? "auto" : "none",
        }}
        aria-hidden={Boolean(onNext)}
      >
        Next
      </Button>
    </div>
  );
}
