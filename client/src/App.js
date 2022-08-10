import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";

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

  function resetRace() {
    stopTimer();
    startRace();
    getRace();
  }

  useEffect(() => {
    setSocket(io.connect("http://localhost:3002"));
  }, []);

  return (
    <div className="racePage">
      <div className="racePageContent">
        {raceProgress ? (
          <ul className="raceProgress">
            {raceProgress.map((horse) => (
              <li key={horse.name}>
                <p>
                  {horse.placement && <span>{horse.placement + " "}</span>}
                  {horse.name}
                </p>
                <p>{horse.distance}</p>
              </li>
            ))}
          </ul>
        ) : (
          <h1>nothing to show </h1>
        )}
        <button onClick={resetRace} />
      </div>
    </div>
  );
}
