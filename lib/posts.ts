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
  featuredImage: string; // <--- NEW FIELD
  featured: boolean;
  status: string;
  tags: string[];
  blocks?: any[];
}

export const getBlocks = cache(async (pageId: string) => {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
    {
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch blocks", await res.text());
    return [];
  }

  const data = await res.json();
  return data.results;
});

export const getAllPosts = cache(async (): Promise<PostMetadata[]> => {
  try {
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
          // We ask Notion to sort, but we will ALSO sort in JS to be 100% sure
          sorts: [{ property: "Date", direction: "descending" }],
        }),
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) return [];

    const data = await res.json();

    const allPosts = data.results.map((page: any) => {
      const props = page.properties;
      const statusVal =
        props.Status?.status?.name || props.Status?.select?.name || "Unknown";

      return {
        id: page.id,
        title:
          props.Name?.title?.[0]?.plain_text ||
          props.Title?.title?.[0]?.plain_text ||
          "Untitled",
        subtitle: props.Subtitle?.rich_text?.[0]?.plain_text || "",
        slug: props.Slug?.rich_text?.[0]?.plain_text || page.id,
        category: props.Category?.select?.name || "Uncategorized",
        date: props.Date?.date?.start || new Date().toISOString().split("T")[0],
        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
        // Existing thumbnail image
        image:
          props.Image?.files?.[0]?.file?.url ||
          props.Image?.files?.[0]?.external?.url ||
          "",
        // <--- NEW: Fetch the FeaturedImage property
        featuredImage:
          props.FeaturedImage?.files?.[0]?.file?.url ||
          props.FeaturedImage?.files?.[0]?.external?.url ||
          "",
        featured: props.Featured?.checkbox || false,
        status: statusVal,
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
      };
    });

    // --- FILTER & SORT ---
    return allPosts
      .filter((post: PostMetadata) => {
        // Only allow Published posts
        return post.status === "Published";
      })
      .sort((a: PostMetadata, b: PostMetadata) => {
        // Enforce Newest -> Oldest (Descending)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error("Critical Fetch Error:", error);
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
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) return null;

  const blocks = await getBlocks(post.id);

  return { ...post, blocks };
}
