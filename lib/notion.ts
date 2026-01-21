import { Client } from "@notionhq/client";

// 1. Check for the key to prevent cryptic runtime errors
if (!process.env.NOTION_API_KEY) {
  throw new Error("Missing NOTION_API_KEY environment variable");
}

// 2. Initialize and EXPORT the client
// This 'export' keyword is what was missing, causing the build error.
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
