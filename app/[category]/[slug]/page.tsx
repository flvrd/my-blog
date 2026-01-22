// 1. THIS IMPORT WAS MISSING:
import ArticleViewer from "@/components/ArticleViewer";
import { getPostBySlug } from "@/lib/posts";

export default async function Page({ params }: any) {
  // Await params for Next.js compatibility
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold text-gray-400">Post not found</h1>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      {/* 1. Styled Header Section */}
      <header className="mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="flex gap-3 items-center text-sm mb-4">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded font-medium text-xs uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-gray-400">•</span>
          <time className="text-gray-500 dark:text-gray-400 font-mono text-xs">
            {post.date}
          </time>
        </div>

        <h1 className="text-4xl md:text-8xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        {/* Render Subtitle if it exists */}
        {post.subtitle && (
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
            {post.subtitle}
          </p>
        )}
      </header>

      {/* 2. Article Content */}
      <ArticleViewer blocks={post.blocks} />
    </main>
  );
}
