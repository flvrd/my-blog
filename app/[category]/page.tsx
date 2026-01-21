import { getCategoryPosts } from "@/lib/posts";
import { ArticleViewer } from "@/components/ArticleViewer";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = await getCategoryPosts(category);
  const firstPost = posts[0];

  if (!firstPost) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No articles found in {category}
      </div>
    );
  }

  // Auto-render the first post so the page isn't empty
  return <ArticleViewer post={firstPost} />;
}
