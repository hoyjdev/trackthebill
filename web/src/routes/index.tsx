import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";

import Counter from "../components/Counter";
import { getBills } from "../lib/bills";
import { getHelloWorld } from "../lib/helloWorld";
import { getCurrentUser, getUsers, login, logout } from "../lib/users";
import logo from "../logo.svg";

// The preload starts these fetches as navigation begins — and it doubles as
// the page's single-flight manifest: after a mutation, the server reruns it
// to put the refreshed data on the action response itself.
export const route = {
  preload: () => {
    void getCurrentUser();
    void getUsers();
    void getHelloWorld();
    void getBills();
  },
} satisfies RouteDefinition;

export default function Home() {
  // Server-function reads: the signed-in user comes off the session cookie
  // (see src/server/session.ts); the user list feeds the sign-in form.
  const me = createMemo(() => getCurrentUser());
  const users = createMemo(() => getUsers());
  const hello = createMemo(() => getHelloWorld());
  const bills = createMemo(() => getBills());

  return (
    <main>
      <Title>Home - Solid App</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Hello Solid!</h1>
      <p>
        From API: <strong>{hello()}</strong>
      </p>
      <section>
        <h2>California Bills</h2>
        <ul>
          <For each={bills()}>
            {(bill) => (
              <li>
                <a
                  href={bill.openstates_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{bill.identifier}</strong>
                </a>
                : {bill.title}{" "}
                <em>
                  ({bill.latest_action_date} - {bill.latest_action_description})
                </em>
              </li>
            )}
          </For>
        </ul>
      </section>

      <Counter />
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      {/* The session pillar: login/logout are actions posting to server
          functions — plain form posts, so they work before hydration too. */}
      <Show
        when={me()}
        fallback={
          <form action={login} method="post">
            <select name="id">
              <For each={users()}>
                {(user) => <option value={user.id}>{user.name}</option>}
              </For>
            </select>{" "}
            <button type="submit">Sign in</button>
          </form>
        }
      >
        {(user) => (
          <form action={logout} method="post">
            Signed in as {user().name}. <button type="submit">Sign out</button>
          </form>
        )}
      </Show>
      <a
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}
