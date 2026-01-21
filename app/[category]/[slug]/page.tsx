import { getPostBySlug } from "@/lib/posts";
import { ArticleViewer } from "@/components/ArticleViewer";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  // 1. Get the specific slug from the URL (e.g., "master-80-percent-notion")
  const { slug } = await params;

  // 2. Fetch THAT specific post
  const post = await getPostBySlug(slug);

  // 3. Handle 404s
  if (!post) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Article not found: {slug}
      </div>
    );
  }

  // 4. Render the specific article
  return <ArticleViewer post={post} />;
}
