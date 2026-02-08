import { Typography } from "@mui/material";
import GoldStar from "../../images/gold-star.svg?react";
import SilverStar from "../../images/silver-star.svg?react";
import BronzeStar from "../../images/bronze-star.svg?react";
import styles from "./ResultsPage.module.css";

type PodiumProps = {
  rank: "1" | "2" | "3";
  text: string;
};

export default function Podium({ rank, text }: PodiumProps) {
  const star =
    rank === "1" ? (
      <GoldStar />
    ) : rank === "2" ? (
      <SilverStar />
    ) : (
      <BronzeStar />
    );

  const rankText = rank === "1" ? "1st" : rank === "2" ? "2nd" : "3rd";

  return (
    <div className={styles.podiumContainer} data-rank={rank}>
      {star}
      <div className={styles.podiumStand}>
        <Typography className={styles.rank}>{rankText}</Typography>
        <Typography className={styles.choice}>{text}</Typography>
      </div>
    </div>
  );
}
