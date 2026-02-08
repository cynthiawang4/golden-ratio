import {
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";
import BackButton from "../../components/BackButton";

const MAX_TOPIC_LENGTH = 127;

export default function HostPage() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState<string>("");
  const [mode, setMode] = useState<"everyone" | "onlyMe" | null>(null);
  const id = useId();

  //dropdown?
  const [choice, setChoice] = useState('');

  // 2. Create the handler to update the state
  const handleChange = (event: any) => {
    setChoice(Number(event.target.value));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNext = async () => {
    // Require mode selection first
    if (!mode) return;

    // Require host to be signed in before creating poll
    const { data: userData } = await auth.getUser();
    const user = (userData as any)?.user ?? null;
    if (!user) {
      // Preserve entered topic and redirect to login
      navigate("/login", { state: { returnTo: "/host", topic: textInput } });
      return;
    }

    const { data, error } = await supabase
      .from('polls')
      .insert({
        title: textInput || 'Untitled',
        owner_id: user.id,
        mode,
        status: 'setup',
        num_choices: choice || 3,
      })
      .select('id')
      .single();

    if (error) return console.error(error);

    navigate(`/room/${data.id}`);
  };

  return (
    <div className={styles.hostContainer}>
      <Stack direction={"row"} width={"100%"}>
        <BackButton onClick={() => navigate("/")} />
      </Stack>
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
        <Button
          className={`${styles.hostButton} ${mode === "everyone" ? styles.selected : ""}`}
          variant="primary"
          onClick={() => setMode("everyone")}
        >
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </Button>
        <Button
          className={`${styles.hostButton} ${mode === "onlyMe" ? styles.selected : ""}`}
          variant="primary"
          onClick={() => setMode("onlyMe")}
        >
          <Typography>Only Me!</Typography>
          <ForMeIcon className={styles.forMeIcon} />
        </Button>
      </div>
      <div className={styles.footer}>
        <div className={styles.dropdownContainer}>
          <Typography className={styles.numberOfChoices}>
            Number of choices:
          </Typography>
          <Select
            renderValue={(value) => (
              <span className={styles.dropdownLabel}>{value}</span>
            )}
            label="Choice"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className={styles.dropdown}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </div>
        <Button onClick={handleNext} variant="primary" disabled={!mode}>
          Next
        </Button>
      </div>
    </div>
  );
}
