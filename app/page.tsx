import { getAllPosts } from "@/lib/posts";
import { ArticleList } from "@/components/ArticleList";
import ArticleViewer from "@/components/ArticleViewer";

// This is your Homepage (localhost:3000)
export default async function HomePage() {
  // 1. Fetch all posts (for the list)
  const posts = await getAllPosts();

  // 2. Select the latest post (for the main view)
  const latestPost = posts[0];

  return (
    // "flex" here makes the List and the Article sit side-by-side
    <div className="flex h-full w-full">
      {/* MIDDLE COLUMN: The Article List */}
      <aside className="w-96 shrink-0 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
        {/* We use ArticleList here, NOT Sidebar */}
        <ArticleList posts={posts} category="all" />
      </aside>

      {/* RIGHT COLUMN: The Latest Article Content */}
      <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-slate-950">
        {latestPost ? (
          <ArticleViewer post={latestPost} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            No posts found.
          </div>
        )}
      </main>
    </div>
  );
}
