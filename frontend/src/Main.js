import "./Main.css";
import { useEffect, useState } from "react";
import Log from "./Log";

const API_BASE = "http://127.0.0.1:5000";

function MainPage({ onLogClicked }) {
  const [armed, setArmed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [daysOffset, setDaysOffset] = useState(0);

  useEffect(() => {
    fetch(API_BASE + "/get-armed")
      .then((res) => res.json())
      .then((data) => {
        setArmed(data["armed"]);
      })
      .catch(() => alert("Error retreiving armed status from camera."));
  }, []);

  useEffect(() => {
    fetch(
      API_BASE +
        `/get-logs?startDate=${getDateXDaysAgo(
          daysOffset
        )}&endDate=${getDateXDaysAgo(daysOffset - 1)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLogs(data["logs"]);
      });
  }, [daysOffset]);

  const getDateXDaysAgo = (x) => {
    const pastDate = new Date();

    // Subtract x days from the current date
    pastDate.setDate(pastDate.getDate() - x);

    const yyyy = pastDate.getFullYear();

    // Get month (0-11) and add 1 to get (1-12), then prefix with 0 if needed
    const mm = String(pastDate.getMonth() + 1).padStart(2, "0");

    // Get day (1-31) and prefix with 0 if needed
    const dd = String(pastDate.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const toggleArmed = () => {
    const options = {
      method: "POST",
    };

    setArmed(!armed);

    if (armed) fetch(API_BASE + "/disarm", options);
    else fetch(API_BASE + "/arm", options);
  };

  return (
    <div className="main">
      <div className="header">
        <h2>Security System Admin Panel</h2>
        <div className="toggle-container">
          <h2>
            System is{" "}
            {armed ? (
              <span style={{ color: "red" }}>Armed</span>
            ) : (
              <span style={{ color: "green" }}>Disarmed</span>
            )}
          </h2>
          <label className="switch">
            <input type="checkbox" id="togBtn" onClick={toggleArmed} />
            <div className="slider round"></div>
          </label>
        </div>
      </div>
      <div className="logs-container">
        <div className="logs-header">
          <h3>Logs</h3>
          <div className="pages">
            <button
              className="prev"
              onClick={() => {
                setDaysOffset(daysOffset + 1);
              }}
            >
              ← Previous
            </button>
            <p>{getDateXDaysAgo(daysOffset)}</p>
            <button
              className="next"
              onClick={() => {
                if (daysOffset > 0) setDaysOffset(daysOffset - 1);
              }}
            >
              Next →
            </button>
          </div>
        </div>

        <div className="logs">
          {logs.map((log, i) => (
            <Log
              key={i}
              url={log.url}
              date={log.date}
              onClick={() => onLogClicked(log.url, log.date)}
            />
          ))}
          {logs.length === 0 && <p>No events to display.</p>}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
