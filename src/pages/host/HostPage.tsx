import { Button, TextField, Typography } from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";

const MAX_TOPIC_LENGTH = 127;

export default function HostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [mode, setMode] = useState<"everyone" | "onlyMe" | null>(null);
  const id = useId();

  const handleCreate = async () => {
    // Require mode selection first
    if (!mode) return;
    
    // Require host to be signed in before creating poll
    const { data: userData } = await auth.getUser();
    const user = (userData as any)?.user ?? null;
    if (!user) {
      // Preserve entered topic and redirect to login
      navigate("/login", { state: { returnTo: "/host", topic: title } });
      return;
    }

    const { data, error } = await supabase
    .from('polls')
    .insert({
      title: title || 'Untitled',
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
          value={title}
          onChange={(e) => {
            if (title.length === MAX_TOPIC_LENGTH) return;
            setTitle(e.target.value);
          }}
          helperText={`${title.length} / ${MAX_TOPIC_LENGTH}`}
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

      <div className={styles.nextContainer}>
        <Button onClick={handleCreate} variant="contained" disabled={!mode}>
          Next
        </Button>
      </div>
    </div>
  );
}
