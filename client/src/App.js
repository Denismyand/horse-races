import "./App.css";
import { useState, useEffect } from "react";
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
    socket.on("ticker", (response) => setRaceProgress(response));
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
    <>
      <button onClick={resetRace} />
      {raceProgress ? (
        <>
          <ul>
            {raceProgress.map((horse) => (
              <li key={horse.name}>
                <p>{horse.name}</p>
                <p>{horse.distance}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h1>nothing to show </h1>
      )}
    </>
  );
}
