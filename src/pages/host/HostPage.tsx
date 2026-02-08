import { TextField, Typography, Menu, MenuItem, Button } from "@mui/material";
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

  // Probably can add db stuff here
  const navigateToChoicePage = () => {
    // CYNTHIA TO DO DB HERE GENERATE ROOM CODE
    const roomId = "1234";
    navigate(`/choice/${roomId}`); //s: choice input page
  // restore topic after OAuth redirect if present
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('preAuth');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.returnTo === '/host' && parsed.topic) {
          setTextInput(parsed.topic);
        }
        sessionStorage.removeItem('preAuth');
      }
    } catch (e) {}
  }, []);

  const handleNext = async () => {
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
      const { data, error } = await supabase.from("polls").insert(insert).select("id").single();
      if (error) throw error;
      const pollId = (data as any).id as string;
      navigate(`/confirmation`, { state: { topic: textInput || "Untitled", roomId: pollId } });
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
        <Button>
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </Button>
        <Button>
          <Typography>Only Me!</Typography>
          <ForMeIcon className={styles.forMeIcon} />
        </Button>
      </div>
      <div>
        <div className={styles.dropdownContainer}>
          <div className={styles.numberOfChoices}>
            <p>
              Number of choices: 
            </p>
          </div>
          <div>
            <Button variant="contained" onClick={handleClick}>
              None
            </Button>
            <Menu className={styles.dropdownItems}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>1</MenuItem>
              <MenuItem onClick={handleClose}>2</MenuItem>
              <MenuItem onClick={handleClose}>3</MenuItem>
              <MenuItem onClick={handleClose}>4</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
}
