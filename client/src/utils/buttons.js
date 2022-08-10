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
        width: "200px",
        fontSize: "20px",
        textTransform: "none",
        gridColumn: "2",
        gridRow:"3",
        justifySelf:"right",
        marginTop: "10px",
      }}
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      Start Race
    </Button>
  );
}
