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

const MAX_CHOICE_LENGTH = 127;

export default function CreateChoicePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<string>("");
  const [maxChoices, setMaxChoices] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>("");
  const [choices, setChoices] = useState<any[]>([]);
  const [savedLabels, setSavedLabels] = useState<Set<string>>(new Set());
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;
    try {
      setLoading(true);
      // load poll from Supabase
      (async () => {
        const { data: poll, error } = await supabase
          .from("polls")
          .select("title, owner_id")
          .eq("id", roomId)
          .single();
        if (!error && poll) {
          setTopic((poll as any).title || "What to eat?");
          setOwnerId((poll as any).owner_id ?? null);
        } else {
          setTopic("What to eat?");
        }

        const { data: choiceList } = await supabase
          .from("choices")
          .select("id, label")
          .eq("poll_id", roomId);
        const labels = ((choiceList as any) || []).map((c: any) => c.label);
        setChoices(labels);
        setSavedLabels(new Set(labels));

        const { data: userData } = await auth.getUser();
        setUser((userData as any)?.user ?? null);
        setMaxChoices(3);
      })();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const handleSuggestChoice = () => {
    const trimmedInput = textInput.trim();
    // 1. Prevent adding empty strings
    if (!trimmedInput) return;

    // 2. Prevent duplicates (Case-insensitive check is usually better)
    if (
      choices.some(
        (choice) => choice.toLowerCase() === trimmedInput.toLowerCase(),
      ) ||
      Array.from(savedLabels).some(
        (s) => s.toLowerCase() === trimmedInput.toLowerCase(),
      )
    ) {
      //alert("This choice already exists!");
      return;
    }

    // 3. Add to the front using the spread operator
    setChoices([trimmedInput, ...choices]);
    // 4. Clear the input
    setTextInput("");
  };

  // Add suggested choices to the database
  const handleSubmit = async () => {
    if (!roomId) return;
    try {
      // insert only new labels not already saved
      const newLabels = choices.filter((label) => !savedLabels.has(label));
      if (newLabels.length === 0) {
        return;
      }
      const payload = newLabels.map((label) => ({ poll_id: roomId, label }));
      const { data: inserted, error } = await supabase
        .from("choices")
        .insert(payload)
        .select("id,label");
      if (error) throw error;
      const insertedLabels = ((inserted as any) || []).map((i: any) => i.label);
      const newSaved = new Set(savedLabels);
      insertedLabels.forEach((l: string) => newSaved.add(l));
      setSavedLabels(newSaved);
    } catch (e) {
      console.error("Failed to save choices", e);
    }
  };

  // TODO: implement what to do on back button
  const handleOnBack = () => {};

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.choiceContainer}>
      <div className={styles.titleWrapper}>
        <IconButton onClick={handleOnBack} className={styles.backButton}>
          <Back />
        </IconButton>
        <Typography className={styles.title}>Topic: {topic}</Typography>
      </div>
      <div className={styles.choiceSection}>
        <div className={styles.textFieldContainer}>
          <Typography className={styles.label}>Write Your Choice</Typography>
          <TextField
            value={textInput}
            onChange={(e) => {
              if (textInput.length === MAX_CHOICE_LENGTH) return;
              setTextInput(e.target.value);
            }}
            className={styles.choiceTextField}
            helperText={`${textInput.length} / ${MAX_CHOICE_LENGTH}`}
          />
          <Stack direction={"row"} justifyContent={"flex-end"} width={"100%"}>
            <Button
              onClick={handleSuggestChoice}
              disabled={textInput.length === 0}
              className={styles.choiceButton}
              variant="primary"
            >
              Suggest
            </Button>
          </Stack>
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
                    // Create a new array including everything EXCEPT the item at index 'i'
                    setChoices(choices.filter((_, index) => index !== i));
                  }}
                />
              );
            })}
          </div>
          <Button
            disabled={choices.length >= maxChoices}
            onClick={handleSubmit}
            className={styles.choiceButton}
            variant="primary"
          >
            Done
          </Button>
        </div>
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
