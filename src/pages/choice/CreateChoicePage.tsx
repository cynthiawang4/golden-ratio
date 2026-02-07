import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CreateChoicePage.module.css";
import { CircularProgress, TextField, Typography, Button } from "@mui/material";
import { supabase, auth } from "../../lib/supabaseClient";

const MAX_CHOICE_LENGTH = 255;

export default function CreateChoicePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<string>("");
  const [maxChoices, setMaxChoices] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>("");
  const [choices, setChoices] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;
    try {
      setLoading(true);
      // load poll from Supabase
      (async () => {
        const { data: poll, error } = await supabase.from("polls").select("title, owner_id").eq("id", roomId).single();
        if (!error && poll) {
          setTopic((poll as any).title || "What to eat?");
          setOwnerId((poll as any).owner_id ?? null);
        } else {
          setTopic("What to eat?");
        }

        const { data: choiceList } = await supabase.from("choices").select("id, label").eq("poll_id", roomId);
        setChoices((choiceList as any) || []);

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

  const addChoice = async () => {
    if (!roomId || !textInput.trim()) return;
    try {
      const { data, error } = await supabase.from("choices").insert({ poll_id: roomId, label: textInput.trim() }).select("id, label").single();
      if (error) throw error;
      setChoices((c) => [...c, data as any]);
      setTextInput("");
    } catch (e) {
      console.error("Failed to add choice", e);
    }
  };

  const handleReveal = () => {
    if (!user) return navigate('/login');
    if (ownerId !== user.id) return alert('Only the host (poll owner) can reveal rankings.');
    navigate(`/results/${roomId}`);
  }

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
              <div style={{ marginTop: 8 }}>
                <Button variant="contained" onClick={addChoice} disabled={!textInput.trim()}>
                  Add Choice
                </Button>
              </div>
            </div>

            <div className={styles.choiceList}>
              {choices.map((c) => (
                <div key={c.id} className={styles.choiceItem}>{c.label}</div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Button variant="outlined" onClick={handleReveal}>
              Reveal Rankings
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
