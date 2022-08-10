import { createTheme } from "@mui/material/styles";
import { Button } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#303f9f",
      light: "#3f51b5",
      dark: "#1a237e",
      contrastText: "#ffffff",
    },
  },
});

export function StartRaceButton({ onClick }) {
  return (
    <Button
      sx={{
        height: "60px",
        width: "250px",
        fontSize: "20px",
        textTransform: "none",
      }}
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      Start Race
    </Button>
  );
}

export function EndRaceButton({ onClick }) {
  return (
    <Button
      sx={{
        height: "60px",
        width: "250px",
        fontSize: "20px",
        textTransform: "none",
      }}
      variant="contained"
      color="error"
      onClick={onClick}
    >
      End Race
    </Button>
  );
}
