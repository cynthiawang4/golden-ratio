import { FormControl, InputLabel, Select, Menu, MenuItem, Button, TextField, Typography } from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";

const MAX_TOPIC_LENGTH = 127;

export default function HostPage() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState<string>("");
  const [mode, setMode] = useState<"everyone" | "onlyMe" | null>(null);
  const id = useId();

  //dropdown?
  const [choice, setChoice] = useState('');

  // 2. Create the handler to update the state
  const handleChange = (event) => {
    setChoice(event.target.value);
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
    })
    .select('id')
    .single()

    if (error) return console.error(error)

    navigate(`/room/${data.id}`)
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
        <Button
          onClick={() => setMode("everyone")}
          className={mode === "everyone" ? styles.selected : ""}
        >
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </Button>
        <Button
          onClick={() => setMode("onlyMe")}
          className={mode === "onlyMe" ? styles.selected : ""}
        >
          <Typography>Only Me!</Typography>
          <ForMeIcon className={styles.forMeIcon} />
        </Button>
      </div>
      <div className={styles.dropdownContainer}>
          <div className={styles.numberOfChoices}>
            <p>
              Number of choices:
            </p>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Choice</InputLabel>
              <Select
                labelId="simple-select-label"
                id="simple-select"
                label="Choice"
                value={choice}
                onChange={handleChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      <div className={styles.nextContainer}>
        <Button onClick={handleNext} variant="primary" disabled={!mode}>
          Next
        </Button>
      </div>
    </div>
  );
}