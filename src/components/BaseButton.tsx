import { Button, ButtonProps, Typography } from "@mui/material";
import styles from "./BaseButton.module.css";

type BaseButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
} & Omit<ButtonProps, "className" | "onClick">;

export default function BaseButton({
  children,
  className,
  onClick,
  ...props
}: BaseButtonProps) {
  return (
    <Button
      {...props}
      className={`${styles.baseButton} ${className ? className : ""}`}
      onClick={onClick}
    >
      {typeof children === "string" ? (
        <Typography>{children}</Typography>
      ) : (
        children
      )}
    </Button>
  );
}
