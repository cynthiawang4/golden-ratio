import { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/Loading";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

type Session = {
  topic: string;
  date: Date;
  created: boolean;
  id: string;
};

const FAKE_SESSIONS: Session[] = [
  {
    id: "0",
    created: true,
    date: new Date(),
    topic: "WHat to Eat",
  },
  {
    id: "1",
    created: true,
    date: new Date(),
    topic: "What to do",
  },
  {
    id: "2",
    created: true,
    date: new Date(),
    topic: "What to dirnk",
  },
  {
    id: "3",
    created: true,
    date: new Date(),
    topic: "What to play",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("Guest");
  const [sessions, setSessions] = useState<Session[]>([]);

  // ID
  const [selectedSession, setSelectedSession] = useState<string | undefined>(
    undefined,
  );
  const [showCreated, setShowCreated] = useState<boolean>(true);
  const navigate = useNavigate();

  // CYNTHIA INITALIZE
  useEffect(() => {
    try {
      setLoading(true);
      setName("Guest");
      setSessions(FAKE_SESSIONS);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // CYNTHIA GET ROOM CODE FROM SELECTED SESSION
  const handleContinue = () => {
    const roomCode = 1234;
    navigate(`/room/${roomCode}`);
  };

  if (loading) return <LoadingPage />;

  const sessionsToShow = sessions.filter((s) => s.created === showCreated);

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.backContainer}>
        <BackButton onClick={() => navigate("/")} />
      </div>
      <div className={styles.content}>
        <Typography className={styles.name}>Hello {name}</Typography>
        <div className={styles.buttonContainer}>
          <ToggleButtonGroup
            value={showCreated}
            exclusive // Ensures only one button can be active at a time
            onChange={(_, newValue) => {
              if (newValue !== null) {
                setShowCreated(newValue);
              }
            }}
            color="primary"
          >
            <ToggleButton color="primary" value={true}>
              Created Topics
            </ToggleButton>
            <ToggleButton color="primary" value={false}>
              Topics in Progress
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={styles.sessionContainer}>
          {sessionsToShow.map((s) => {
            const isSelected = s.id === selectedSession;
            return (
              <Button
                className={`${styles.sessionBlock} ${isSelected ? styles.selected : ""}`}
                onClick={() => setSelectedSession(s.id)}
                disableRipple
              >
                <Typography>{s.topic}</Typography>
                <Typography>{s.date.toDateString()}</Typography>
              </Button>
            );
          })}
          {sessionsToShow.length === 0 && (
            <Typography className={styles.noSessions}>
              Oops no sessions
            </Typography>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          disabled={selectedSession === undefined}
          variant="primary"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
