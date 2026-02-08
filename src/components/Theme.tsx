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
      paper: "#1C254B", // Dark Navy Card background
    },
    // Text
    text: {
      primary: "#F6FAF3",
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
      hover: "#9C70CB",
      selected: "#1C254B",
      focus: "#b6e1fa",
      disabled: "#676A71",
      disabledBackground: "#A9A9A9",
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
          style: () => ({
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "5px solid #f5d8c0",
            color: "#3E67B9",
            boxShadow: "0px 6px 0px 0px #F5D8C0",

            "&:hover": {
              backgroundColor: "#78A5FF",
              color: "#fff",
              border: "5px solid #FFFFFF",
              boxShadow: "0px 6px 0px 0px #B2CCFF",
            },
          }),
        },
        {
          props: { variant: "secondary" },
          style: ({ theme }) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.main,
            boxShadow: "0px 4px 0px 0px #1C254B",
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
          backgroundColor: "#fff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.action.focus}`,
            outlineOffset: "5px",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            border: `5px solid #A4A4A4`,
            color: theme.palette.action.disabled,
            cursor: "not-allowed",
            boxShadow: "0px 5px 0px 0px #A9A9A9",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `4px solid ${theme.palette.primary.contrastText}`,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "30px",
          "& input": {
            color: theme.palette.text.primary,
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          // Error state
          "&.Mui-error": {
            borderColor: theme.palette.error.main,
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginTop: "4px",
          color: `${theme.palette.error.main} !important`,
          fontSize: "0.9rem",
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
