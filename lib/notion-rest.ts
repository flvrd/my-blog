export interface NotionPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featured: boolean;
  tags: string[];
  content: string;
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

async function notionRequest(endpoint: string, options: any = {}) {
  const url = `https://api.notion.com/v1${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Notion API error: ${error.message || response.statusText}`,
    );
  }

  return response.json();
}

function extractPlainText(richText: any[]): string {
  if (!richText || richText.length === 0) return "";
  return richText.map((t) => t.plain_text).join("");
}

async function getBlockChildren(blockId: string): Promise<string> {
  const blocks = await notionRequest(
    `/blocks/${blockId}/children?page_size=100`,
  );

  let markdown = "";

  for (const block of blocks.results) {
    const type = block.type;
    const content = block[type];

    switch (type) {
      case "paragraph":
        markdown += extractPlainText(content.rich_text) + "\n\n";
        break;
      case "heading_1":
        markdown += `# ${extractPlainText(content.rich_text)}\n\n`;
        break;
      case "heading_2":
        markdown += `## ${extractPlainText(content.rich_text)}\n\n`;
        break;
      case "heading_3":
        markdown += `### ${extractPlainText(content.rich_text)}\n\n`;
        break;
      case "bulleted_list_item":
        markdown += `- ${extractPlainText(content.rich_text)}\n`;
        break;
      case "numbered_list_item":
        markdown += `1. ${extractPlainText(content.rich_text)}\n`;
        break;
      case "code":
        const code = extractPlainText(content.rich_text);
        const language = content.language || "";
        markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;
      case "quote":
        markdown += `> ${extractPlainText(content.rich_text)}\n\n`;
        break;
      default:
        // Handle other block types as plain text
        if (content.rich_text) {
          markdown += extractPlainText(content.rich_text) + "\n\n";
        }
    }
  }

  return markdown;
}

export async function getNotionPosts(): Promise<NotionPost[]> {
  try {
    console.log("Fetching from Notion (REST API)...");

    const response = await notionRequest(
      `/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          sorts: [
            {
              property: "Date",
              direction: "descending",
            },
          ],
        }),
      },
    );

    console.log(`Found ${response.results.length} published posts`);

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        const props = page.properties;

        // Debug: log what properties we actually have
        console.log("Available properties:", Object.keys(props));

        // Extract each property safely with fallbacks
        const title =
          props.Title?.title?.[0]?.plain_text ||
          props.Name?.title?.[0]?.plain_text ||
          "Untitled";

        const slug =
          props.Slug?.rich_text?.[0]?.plain_text ||
          props.slug?.rich_text?.[0]?.plain_text ||
          title.toLowerCase().replace(/\s+/g, "-");

        const category =
          props.Category?.select?.name ||
          props.category?.select?.name ||
          "uncategorized";

        const date =
          props.Date?.date?.start ||
          props.date?.date?.start ||
          new Date().toISOString().split("T")[0];

        const excerpt =
          props.Excerpt?.rich_text?.[0]?.plain_text ||
          props.excerpt?.rich_text?.[0]?.plain_text ||
          "";

        const featured =
          props.Featured?.checkbox || props.featured?.checkbox || false;

        const tags =
          props.Tags?.multi_select?.map((tag: any) => tag.name) ||
          props.tags?.multi_select?.map((tag: any) => tag.name) ||
          [];

        const content = await getBlockChildren(page.id);

        console.log("Parsed post:", { title, slug, category, date });

        return {
          id: page.id,
          slug,
          title,
          date,
          category,
          excerpt,
          featured,
          tags,
          content,
        };
      }),
    );

    return posts;
  } catch (error: any) {
    console.error("Error fetching from Notion (REST API):", error.message);
    throw error;
  }
}

export async function getNotionPostBySlug(
  slug: string,
): Promise<NotionPost | null> {
  const posts = await getNotionPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getNotionPostsByCategory(
  category: string,
): Promise<NotionPost[]> {
  const posts = await getNotionPosts();
  return posts.filter((post) => post.category === category);
}
