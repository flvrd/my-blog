import { cache } from "react";

// 1. CONFIGURATION
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) throw new Error("MISSING ENV: NOTION_API_KEY");
if (!NOTION_DATABASE_ID) throw new Error("MISSING ENV: NOTION_DATABASE_ID");

export interface PostMetadata {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  featured: boolean;
  status: string;
  tags: string[];
  content?: string;
  content?: string; // <-- Add this line
}

export const getAllPosts = cache(async (): Promise<PostMetadata[]> => {
  try {
    console.log("Fetching Notion Data...");

    // 1. Fetch EVERYTHING (No Filter) to debug
    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sorts: [{ property: "Date", direction: "descending" }],
        }),
        next: { revalidate: 1 }, // Disable cache to see changes immediately
      },
    );

    if (!res.ok) {
      console.error(`🚨 Notion Error ${res.status}:`, await res.text());
      return [];
    }

    const data = await res.json();
    console.log(`✅ Connection Success! Found ${data.results.length} rows.`);

    // 2. Map the data safely
    return data.results.map((page: any) => {
      const props = page.properties;

      // Log the exact Status value so we can fix the filter later
      const statusVal =
        props.Status?.select?.name || props.Status?.status?.name || "Unknown";

      return {
        id: page.id,
        // Title: Handle different casing of "Name" or "title"
        title:
          props.Name?.title?.[0]?.plain_text ||
          props.Title?.title?.[0]?.plain_text ||
          "Untitled",
        subtitle: props.Subtitle?.rich_text?.[0]?.plain_text || "",
        slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,

        // Category: Handle Select type
        category: props.Category?.select?.name || "Uncategorized",

        // Date: Handle Date type
        date: props.Date?.date?.start || new Date().toISOString().split("T")[0],

        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
        image:
          props.Image?.files?.[0]?.file?.url ||
          props.Image?.files?.[0]?.external?.url ||
          "",
        featured: props.Featured?.checkbox || false,

        // Status: Handle BOTH Select and Status types
        status: statusVal,
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
        content: props.Content?.rich_text?.[0]?.plain_text || "", // <-- Add this line
      };
    });
  } catch (error) {
    console.error("🚨 Critical Fetch Error:", error);
    return [];
  }
});

// Helpers
export async function getUniqueCategories() {
  const posts = await getAllPosts();
  // Filter out undefined/null categories
  const categories = new Set(
    posts.map((p) => p.category).filter((c) => c && c !== "Uncategorized"),
  );
  return Array.from(categories).sort();
}

export async function getCategoryPosts(category: string) {
  const allPosts = await getAllPosts();
  if (category === "all") return allPosts;
  return allPosts.filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase(),
  );
}

export async function getPostBySlug(slug: string) {
  const allPosts = await getAllPosts();
  return allPosts.find((p) => p.slug === slug) || null;
}
