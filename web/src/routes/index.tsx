import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";

import Counter from "../components/Counter";
import { getBills } from "../lib/bills";
import { getHelloWorld } from "../lib/helloWorld";
import { getCurrentUser, getUsers, login, logout } from "../lib/users";
import logo from "../logo.svg";

export const route = {
  preload: () => {
    void getBills();
  },
} satisfies RouteDefinition;

export default function Home() {
  const bills = createMemo(() => getBills());

  return (
    <main>
      <Title>Home - Solid App</Title>
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
    </main>
  );
}
