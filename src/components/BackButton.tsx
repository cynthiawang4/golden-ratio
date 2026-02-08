import { IconButton } from "@mui/material";
import styles from "./BackButton.module.css";
import Back from "../images/back.svg?react";

type BackButtonProps = {
  className?: string;
  onClick: () => void;
};

export default function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      className={`${styles.backButton} ${className ? className : ""}`}
    >
      <Back />
    </IconButton>
  );
}
