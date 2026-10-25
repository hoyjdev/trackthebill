import { Title } from "@solidjs/meta";
import { Errored, Loading } from "solid-js";
// Typed client env, validated and baked in at build time (see env.ts).
import { env } from "virtual:env/client";
import { Router } from "./router";
import "./App.css";

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>{env.VITE_APP_NAME}</Title>
          <Errored
            fallback={(err, reset) => (
              <main>
                <p>Something went wrong: {String(err)}</p>
                <button onClick={reset}>Try again</button>
              </main>
            )}
          >
            <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
          </Errored>
        </>
      )}
    </Router>
  );
}
