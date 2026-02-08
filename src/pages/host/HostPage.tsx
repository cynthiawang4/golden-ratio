import { FormControl, InputLabel, Select, Menu, MenuItem, Button, TextField, Typography } from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useEffect, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";

const MAX_TOPIC_LENGTH = 127;

export default function HostPage() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<"everyone" | "onlyMe" | null>(null);
  const id = useId();

  //dropdown?
  const [choice, setChoice] = useState('');

  // 2. Create the handler to update the state
  const handleChange = (event) => {
    setChoice(event.target.value);
  };


  // restore topic after OAuth redirect if present
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("preAuth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.returnTo === "/host" && parsed.topic) {
          setTextInput(parsed.topic);
        }
        sessionStorage.removeItem("preAuth");
      }
    } catch (e) {}
  }, []);

  const handleNext = async () => {
    // require mode selection first
    if (!selectedMode) return;
    
    // require host to be signed in before creating poll
    try {
      const { data: userData } = await auth.getUser();
      const user = (userData as any)?.user ?? null;
      if (!user) {
        // preserve entered topic and redirect to login
        navigate("/login", { state: { returnTo: "/host", topic: textInput } });
        return;
      }

      const insert = {
        owner_id: user.id,
        title: textInput || "Untitled",
      };
      const { data, error } = await supabase
        .from("polls")
        .insert(insert)
        .select("id")
        .single();
      if (error) throw error;
      const pollId = (data as any).id as string;
      navigate(`/confirmation`, { state: { topic: textInput || "Untitled", roomId: pollId, mode: selectedMode } });
    } catch (e) {
      console.error("Failed to create poll", e);
    }
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
          onClick={() => setSelectedMode("everyone")}
          className={selectedMode === "everyone" ? styles.selected : ""}
        >
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </Button>
        <Button
          onClick={() => setSelectedMode("onlyMe")}
          className={selectedMode === "onlyMe" ? styles.selected : ""}
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
        <Button onClick={handleNext} variant="contained" disabled={!selectedMode}>
          Next
        </Button>
      </div>
    </div>
  );
}