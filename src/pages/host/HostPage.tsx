import { TextField, Typography, Menu, MenuItem, Button } from "@mui/material";
import styles from "./HostPage.module.css";
import { useId, useState } from "react";
import EveryoneIcon from "../../images/everyone.svg?react";
import ForMeIcon from "../../images/for-me.svg?react";
import { useNavigate } from "react-router-dom";
import BaseButton from "../../components/BaseButton";

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
        <BaseButton
          onClick={navigateToChoicePage}
          className={styles.hostButton}
        >
          <Typography>Everyone</Typography>
          <EveryoneIcon className={styles.everyoneIcon} />
        </BaseButton>
        <BaseButton
          onClick={navigateToChoicePage}
          className={styles.hostButton}
        >
          <Typography>Only Me!</Typography>
          <ForMeIcon className={styles.forMeIcon} />
        </BaseButton>
      </div>
      <div>
        <div className={styles.dropdownContainer}>
          <div className={styles.numberOfChoices}>
            <p>
              Number of choices: 
            </p>
          </div>
          <div>
            <Button className={styles.dropdownMenu} variant="contained" onClick={handleClick}>
              None
            </Button>
            <Menu
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
