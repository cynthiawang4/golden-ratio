import { Button, TextField, Typography } from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";

const MAX_TOPIC_LENGTH = 127;

export default function HostPage() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState<string>("");
  const id = useId();

  // Probably can add db stuff here
  const navigateToChoicePage = () => {
    // CYNTHIA TO DO DB HERE GENERATE ROOM CODE
    const roomId = "1234";
    navigate(`/choice/${roomId}`);
  };

  return (
    <div className={styles.hostContainer}>
      <div className={styles.topicContainer}>
        <Typography id={id} className={styles.topic}>
          Topic
        </Typography>
        <TextField
          placeholder="What to eat"
          value={textInput}
          onChange={(e) => {
            if (textInput.length === MAX_TOPIC_LENGTH) return;
            setTextInput(e.target.value);
          }}
          helperText={`${textInput.length} / ${MAX_TOPIC_LENGTH}`}
          className={styles.topicTextField}
        />
      </div>
      <Typography className={styles.title}>
        Who is providing the choices?
      </Typography>
      <div className={styles.buttonContainer}>
        <Button onClick={navigateToChoicePage}>
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </Button>
        <Button onClick={navigateToChoicePage}>
          <Typography>Only Me!</Typography>
          <ForMeIcon className={styles.forMeIcon} />
        </Button>
      </div>
    </div>
  );
}
