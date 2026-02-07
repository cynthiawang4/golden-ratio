import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CreateChoicePage.module.css";
import {
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BaseButton from "../../components/BaseButton";
import Trash from "../../images/trash.svg?react";
import Back from "../../images/back.svg?react";

const MAX_CHOICE_LENGTH = 127;

export default function CreateChoicePage() {
  const { roomId } = useParams();
  const [topic, setTopic] = useState<string>("");
  const [maxChoices, setMaxChoices] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);

  // CYNTHIA SYNC WITH DB AND GET TOPIC QUESTION and MAX CHOICES OR SHOULD PROPS BE PASSED IDK
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

  const handleSuggestChoice = () => {
    const trimmedInput = textInput.trim();
    // 1. Prevent adding empty strings
    if (!trimmedInput) return;

    // 2. Prevent duplicates (Case-insensitive check is usually better)
    if (
      choices.some(
        (choice) => choice.toLowerCase() === trimmedInput.toLowerCase(),
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

  // CYNTHIA ADD CHOICES TO DATABASE THEY CAN SEND EMPTY
  const handleSubmit = () => {};

  // CYNTHIA IF HOST DELETE ROOM?? ELSE GO BACK TO LANDING PAGE?
  const handleOnBack = () => {};

  return (
    <div className={styles.choiceContainer}>
      {loading && <CircularProgress />}
      {!loading && (
        <>
          <div className={styles.titleWrapper}>
            <IconButton onClick={handleOnBack} className={styles.backButton}>
              <Back />
            </IconButton>
            <Typography className={styles.title}>Topic: {topic}</Typography>
          </div>
          <div className={styles.choiceSection}>
            <div className={styles.textFieldContainer}>
              <Typography className={styles.label}>
                Write Your Choice
              </Typography>
              <TextField
                value={textInput}
                onChange={(e) => {
                  if (textInput.length === MAX_CHOICE_LENGTH) return;
                  setTextInput(e.target.value);
                }}
                className={styles.choiceTextField}
                helperText={`${textInput.length} / ${MAX_CHOICE_LENGTH}`}
              />
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                width={"100%"}
              >
                <BaseButton
                  onClick={handleSuggestChoice}
                  disabled={textInput.length === 0}
                  className={styles.choiceButton}
                >
                  Suggest
                </BaseButton>
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
              <BaseButton
                disabled={choices.length >= maxChoices}
                onClick={handleSubmit}
                className={styles.choiceButton}
              >
                Done
              </BaseButton>
            </div>
          </div>
        </>
      )}
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
