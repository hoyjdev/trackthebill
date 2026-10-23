import { query } from "@solidjs/router";
import env from "virtual:env/server";

export const getHelloWorld = query(async () => {
  "use server";
  const response = await fetch(`${env.INTERNAL_API_URL}/`);
  return await response.text();
}, "hello-world");
