import { Typography } from "@mui/material";
import styles from "./Text.module.css";

type TitleTextProps = {
  children: React.ReactNode;
  className?: string;
};

export function TitleText({ children, className }: TitleTextProps) {
  return (
    <Typography className={`${styles.title} ${className ? className : ""}`}>
      {children}
    </Typography>
  );
}
