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
}

export const getAllPosts = cache(async (): Promise<PostMetadata[]> => {
  try {
    // -------------------------------------------------------
    // FETCH EVERYTHING (NO FILTERS)
    // -------------------------------------------------------
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
        next: { revalidate: 1 }, // No caching while debugging
      },
    );

    if (!res.ok) {
      console.error(`🚨 Notion Error ${res.status}:`, await res.text());
      return [];
    }

    const data = await res.json();
    console.log(`✅ FOUND ${data.results.length} POSTS in Notion.`);

    return data.results.map((page: any) => {
      const props = page.properties;

      // SAFETY: Check both 'select' (dropdown) and 'status' (workflow) types
      const statusVal =
        props.Status?.status?.name || props.Status?.select?.name || "Unknown";

      // LOGGING: See exactly what Notion is returning for the first post
      // console.log("Post Title:", props.Name?.title?.[0]?.plain_text, "Status:", statusVal);

      return {
        id: page.id,
        title: props.Name?.title?.[0]?.plain_text || "Untitled",
        subtitle: props.Subtitle?.rich_text?.[0]?.plain_text || "",
        slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,
        category: props.Category?.select?.name || "Uncategorized",
        date: props.Date?.date?.start || "",
        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
        image:
          props.Image?.files?.[0]?.file?.url ||
          props.Image?.files?.[0]?.external?.url ||
          "",
        featured: props.Featured?.checkbox || false,
        status: statusVal,
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
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
