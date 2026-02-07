import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CreateChoicePage.module.css";
import { CircularProgress, TextField, Typography } from "@mui/material";

const MAX_CHOICE_LENGTH = 255;

export default function CreateChoicePage() {
  const { roomId } = useParams();
  const [topic, setTopic] = useState<string>("");
  const [maxChoices, setMaxChoices] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>("");

  // CYNTHIA SYNC WITH DB AND GET TOPIC QUESTION and MAX CHOICES
  useEffect(() => {
    if (!roomId) return;
    try {
      setLoading(true);
      setTopic("What to eat?");
      setMaxChoices(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  return (
    <div className={styles.choiceContainer}>
      {loading && <CircularProgress />}
      {!loading && (
        <>
          <Typography className={styles.title}>{topic}</Typography>
          <div className={styles.choiceSection}>
            <div className={styles.textFieldContainer}>
              <Typography className={styles.label}>
                Write Your Choice
              </Typography>
              <TextField
                multiline
                value={textInput}
                onChange={(e) => {
                  if (textInput.length === MAX_CHOICE_LENGTH) return;
                  setTextInput(e.target.value);
                }}
                helperText={`${textInput.length} / ${MAX_CHOICE_LENGTH}`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
