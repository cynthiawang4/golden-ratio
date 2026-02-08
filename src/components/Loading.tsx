import { CircularProgress } from "@mui/material";
import styles from "./Loading.module.css";

export default function LoadingPage() {
  return (
    <div className={styles.loadingContainer}>
      <CircularProgress color="secondary" size={"3rem"} />
    </div>
  );
}
