import { query } from "@solidjs/router";
import env from "virtual:env/server";

export interface Bill {
  id: string;
  identifier: string;
  title: string;
  session: string;
  latest_action_description: string;
  latest_action_date: string;
  openstates_url: string;
}

export const getBills = query(async (): Promise<Bill[]> => {
  "use server";
  const response = await fetch(`${env.INTERNAL_API_URL}/bills`);
  if (!response.ok) {
    throw new Error(`Failed to fetch bills: ${response.status}`);
  }
  return await response.json();
}, "bills");
