import React from "react";
import { getCategoryPosts } from "@/lib/posts";
import { ArticleList } from "@/components/ArticleList";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export default async function CategoryLayout({
  children,
  params,
}: CategoryLayoutProps) {
  const { category } = await params;
  const posts = await getCategoryPosts(category);

  return (
    // "flex" ensures the Middle List and Right Content sit side-by-side
    <div className="flex h-full w-full overflow-hidden">
      {/* MIDDLE COLUMN: The Article List 
          (This was likely <Sidebar> in your code, which caused the duplicate) 
      */}
      <aside className="w-96 shrink-0 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
        <ArticleList posts={posts} category={category} />
      </aside>

      {/* RIGHT COLUMN: The Article Content 
          (This is where the [slug]/page.tsx content goes) 
      */}
      <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
