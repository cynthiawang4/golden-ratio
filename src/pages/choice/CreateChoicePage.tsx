import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CreateChoicePage.module.css";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Trash from "../../images/trash.svg?react";
import Back from "../../images/back.svg?react";
import LoadingPage from "../../components/Loading";
import { supabase, auth } from "../../lib/supabaseClient";
import BackButton from "../../components/BackButton";

const MAX_CHOICE_LENGTH = 127;

interface CreateChoicePageProps {
  roomId?: string;
  poll: any;
  isHost: boolean;
  onDoneChoices?: () => void;
}

export default function CreateChoicePage({ roomId, poll, isHost, onDoneChoices, }: CreateChoicePageProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [choices, setChoices] = useState<any[]>([]);
  const [savedLabels, setSavedLabels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChoices = async () => {
      setLoading(true);
      try {
        const { data: choiceList } = await supabase
          .from("choices")
          .select("id, label")
          .eq("poll_id", roomId);
        const labels = ((choiceList as any) || []).map((c: any) => c.label);
        setChoices(labels);
        setSavedLabels(new Set(labels));
      } catch (e) {
        console.error("Error fetching choices", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChoices();
  }, [roomId]);

  const handleAddChoice = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (
      choices.some(
        (choice) => choice.toLowerCase() === trimmedInput.toLowerCase(),
      ) ||
      Array.from(savedLabels).some(
        (s) => s.toLowerCase() === trimmedInput.toLowerCase(),
      )
    ) {
      return;
    }

    setChoices([trimmedInput, ...choices]);
    setInput("");
  };

  const handleSubmit = async () => {
    if (!roomId) return;

    try {
      const newLabels = choices.filter((label) => !savedLabels.has(label));

      if (newLabels.length > 0) {
        const payload = newLabels.map((label) => ({
          poll_id: roomId,
          label,
        }));

        const { error } = await supabase.from("choices").insert(payload);
        if (error) throw error;
      }

      // Move to collectingDone
      await supabase
        .from("polls")
        .update({ status: "collectingDone" })
        .eq("id", roomId);
    } catch (e) {
      console.error("Failed to save choices", e);
    }
  };

  const handleOnBack = () => {
    navigate(`/room/${roomId}`);
  };

  if (loading) return <LoadingPage />;

  const isCollectingDone = poll?.status === "collectingDone" || poll?.status === "rankingDone";

  return (
    <div className={styles.choiceContainer}>
      <div className={styles.titleWrapper}>
        <IconButton onClick={handleOnBack} className={styles.backButton}>
          <Back />
        </IconButton>
        <Typography className={styles.title}>Topic: {poll?.title}</Typography>
      </div>
      <div className={styles.choiceSection}>
        <div className={styles.textFieldContainer}>
          <Typography className={styles.label}>Write Your Choice</Typography>
          <TextField
            value={input}
            onChange={(e) => {
              if (input.length === MAX_CHOICE_LENGTH) return;
              setInput(e.target.value);
            }}
            className={styles.choiceTextField}
            helperText={`${input.length} / ${MAX_CHOICE_LENGTH}`}
            disabled={isCollectingDone || (!isHost && poll?.mode === "onlyMe")}
          />
          <div className={styles.suggestButtonWrapper}>
            <Button
              onClick={handleAddChoice}
              disabled={input.length === 0 || isCollectingDone || (!isHost && poll?.mode === "onlyMe")}
              className={styles.choiceButton}
              variant="primary"
            >
              Suggest
            </Button>
          </div>
        </div>
        <div className={styles.choiceListWrapper}>
          <Typography className={styles.label}>Your Choices</Typography>
          <div className={styles.choiceListContainer}>
            {choices.map((choice, i) => {
              return (
                <ChoiceBlock
                  key={i}
                  text={choice}
                  onDelete={() => {
                    if (isHost || poll?.mode === "everyone") {
                      setChoices(choices.filter((_, index) => index !== i));
                    }
                  }}
                />
              );
            })}
          </div>
          <Button
            onClick={handleSubmit}
            className={styles.choiceButton}
            variant="primary"
            disabled={choices.length === 0 || isCollectingDone || (!isHost && poll?.mode === "onlyMe")}
          >
            Upload
          </Button>
        </div>

        <Button
          onClick={onDoneChoices}
          className={styles.choiceButton}
          variant="primary"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

type ChoiceBlockProps = {
  text: string;
  onDelete: () => void;
};

function ChoiceBlock({ onDelete, text }: ChoiceBlockProps) {
  return (
    <div className={styles.choiceBlock}>
      <Typography>{text}</Typography>
      <IconButton onClick={onDelete} className={styles.deleteButton}>
        <Trash />
      </IconButton>
    </div>
  );
}
