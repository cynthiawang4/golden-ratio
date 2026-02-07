import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#f5d8c0",
      light: "#f9e8d9",
      dark: "#ac9786",
      contrastText: "#3e67b9",
    },
    secondary: {
      main: "#bca0da",
      light: "#d5bdfc",
      dark: "#8269a7",
      contrastText: "#3e67b9",
    },
    // Backgrounds
    background: {
      default: "#253164", // Mid-blue
      paper: "#1c2b5e", // Dark Navy Card background
    },
    // Text
    text: {
      primary: "#ffffff",
      secondary: "#f5d8c0", // Using your primary as the sub-text color looks great
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    // Semantic Colors (Adjusted to fit your pastel/soft vibe)
    error: {
      main: "#faa082",
      light: "#ffc4b0",
      dark: "#c47d65",
      contrastText: "#3e67b9",
    },
    warning: {
      main: "#fdeac9", // Pale yellow/orange
      contrastText: "#3e67b9",
    },
    // Action states
    action: {
      active: "#f5d8c0",
      hover: "rgba(182, 225, 250, 0.12)",
      selected: "rgba(182, 225, 250, 0.2)",
      focus: "#b6e1fa",
      disabled: "rgba(253, 234, 201, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  spacing: (factor: number) => `${factor}rem`,
  components: {
    MuiButton: {
      defaultProps: {
        disableFocusRipple: true,
      },
      variants: [
        {
          props: { variant: "primary" },
          style: ({ theme }) => ({
            border: `2px solid ${theme.palette.primary.light}`,
            color: theme.palette.primary.main,
          }),
        },
        {
          props: { variant: "secondary" },
          style: ({ theme }) => ({
            border: `2px solid ${theme.palette.secondary.main}`,
            color: theme.palette.secondary.main,
          }),
        },
        {
          props: { variant: "cancel" },
          style: ({ theme }) => ({
            border: `2px solid ${theme.palette.error.main}`,
            color: theme.palette.error.main,
          }),
        },
      ],
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.action.focus}`,
            outlineOffset: "5px",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabled,
            border: `2px solid ${theme.palette.text.disabled}`,
            color: theme.palette.text.disabled,
            cursor: "not-allowed",
          },
        }),
      },
    },
  },
};

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseTheme = createTheme(themeOptions);

  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
}
