import { useEffect, useState } from "react";
import "./App.css";

type Health = {
  status: string;
  db: boolean;
  time: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Health>;
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="health">
      <h1>Vantex Soft</h1>

      {error && <p className="down">API unreachable: {error}</p>}

      {!error && !health && (
        <p>Checking API… (a sleeping free server can take up to a minute)</p>
      )}

      {health && (
        <dl>
          <dt>Status</dt>
          <dd className={health.status === "UP" ? "up" : "down"}>
            {health.status}
          </dd>
          <dt>Database</dt>
          <dd className={health.db ? "up" : "down"}>
            {health.db ? "connected" : "unreachable"}
          </dd>
          <dt>Server time (UTC)</dt>
          <dd>{health.time}</dd>
        </dl>
      )}

      <p className="api">API: {API_URL || "same origin (Vite dev proxy)"}</p>
    </main>
  );
}

export default App;
