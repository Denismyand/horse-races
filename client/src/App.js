import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { ThemeProvider, Stack } from "@mui/system";
import { theme, StartRaceButton, EndRaceButton } from "./utils/buttons.js";

export default function App() {
  const [socket, setSocket] = useState(null);
  const [raceProgress, setRaceProgress] = useState(null);

  const startRace = () => {
    socket.emit("start");
  };

  const stopTimer = () => {
    socket.disconnect();
    socket.connect("http://localhost:3002");
  };

  const getRace = () => {
    let newRace = [];
    let placement = 1;

    function horseIsUndefined(horse) {
      if (newRace.length > 0) {
        return (
          newRace.find((newHorse) => horse.name === newHorse.name).placement ===
          undefined
        );
      }
      return false;
    }

    function horseHasPlacement(horse) {
      let toCheck = newRace.find((newHorse) => horse.name === newHorse.name);
      if (toCheck !== undefined) {
        if (toCheck.placement) {
          return true;
        }
      }
      return false;
    }

    socket.on("ticker", (response) => {
      newRace = response.map((horse) => {
        if (horseHasPlacement(horse)) {
          return newRace.find((newHorse) => horse.name === newHorse.name);
        }
        if (horseIsUndefined(horse) && horse.distance >= 1000) {
          horse = { ...horse, placement: placement };
          placement++;
        }
        return horse;
      });
      setRaceProgress(
        newRace.sort(
          (a, b) => b.distance - a.distance || a.placement - b.placement
        )
      );
    });
  };

  function getSuffix(i) {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  function handleStartRace() {
    stopTimer();
    startRace();
    getRace();
  }

  function handleEndRace() {
    stopTimer();
    setRaceProgress(null);
  }

  useEffect(() => {
    setSocket(io.connect("http://localhost:3002"));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="racePage">
        <div className="raceContent">
          {raceProgress ? (
            <ul className="raceProgress">
              <p>
                <b>{"Horse name"}</b>
              </p>
              <p>
                <b>{"Distance traveled"}</b>
              </p>
              <p>
                <b>{"Placement"}</b>
              </p>
              {raceProgress.map((horse) => (
                <li key={horse.name} className="horseStats">
                  <p>{horse.name}</p>
                  <p>{horse.distance >= 1000 ? "Finished" : horse.distance}</p>
                  {horse.placement && <p>{getSuffix(horse.placement)}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="noRaceText">
              <div>
                <h1>There is no race in progress</h1>
                <p>Please click "Start race" to start the race</p>
              </div>
            </div>
          )}
        </div>
        <Stack
          direction="row"
          sx={{ gridColumn: "2", gridRow: "3", justifySelf: "right" }}
          spacing="20px"
        >
          <EndRaceButton onClick={handleEndRace} />
          <StartRaceButton onClick={handleStartRace} />
        </Stack>
      </div>
    </ThemeProvider>
  );
}
