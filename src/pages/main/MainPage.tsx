import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";
import { Button, Typography } from "@mui/material";
import logo from "../../images/logo.svg";

export default function MainPage() {
  const navigate = useNavigate();

  const handleHostButton = () => {
    navigate("/host");
  };

  const handleLoginLink = () => {
    navigate("/login");
  };

  return (
    <div className={styles.mainContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <div className={styles.contentContainer}>
        <Typography className={styles.title}>GOLDEN RATIO</Typography>
        <div className={styles.buttonContainer}>
          <Button variant="secondary" onClick={handleHostButton}>
            CREATE POLL
          </Button>
          <a onClick={handleLoginLink} className={styles.loginText}>
            login
          </a>
        </div>
      </div>
    </div>
  );
}
