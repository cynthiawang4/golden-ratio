import { Menu, MenuItem, Button, TextField, Typography } from "@mui/material";
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
  const [selectedMode, setSelectedMode] = useState<
    "everyone" | "onlyMe" | null
  >(null);
  const id = useId();

  //dropdown?
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Sets the button as the anchor
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      navigate(`/confirmation`, {
        state: {
          topic: textInput || "Untitled",
          roomId: pollId,
          mode: selectedMode,
        },
      });
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
          <p>Number of choices:</p>
        </div>
        <div>
          <Button variant="contained" onClick={handleClick}>
            None
          </Button>
          <Menu
            className={styles.dropdownItems}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                className: styles.dropdownMenu,
              },
            }}
          >
            <MenuItem onClick={handleClose}>1</MenuItem>
            <MenuItem onClick={handleClose}>2</MenuItem>
            <MenuItem onClick={handleClose}>3</MenuItem>
            <MenuItem onClick={handleClose}>4</MenuItem>
          </Menu>
        </div>
      </div>
      <div className={styles.nextContainer}>
        <Button onClick={handleNext} variant="primary" disabled={!selectedMode}>
          Next
        </Button>
      </div>
    </div>
  );
}
