"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PostMetadata } from "@/lib/posts";

interface ArticleListProps {
  posts: PostMetadata[];
  category: string;
}

export function ArticleList({ posts, category }: ArticleListProps) {
  const pathname = usePathname();

  const currentPath = pathname?.toLowerCase().replace(/\/$/, "") || "";
  const rootPath = `/${category.toLowerCase()}`;
  let selectedPostId = "";

  if (currentPath === rootPath && posts.length > 0) {
    selectedPostId = posts[0].id;
  } else {
    const found = posts.find((p) => {
      const targetCat =
        category.toLowerCase() === "all" ? "all" : p.category || category;
      return `/${targetCat}/${p.slug}`.toLowerCase() === currentPath;
    });
    if (found) selectedPostId = found.id;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER: Changed to font-sans for that clean "App" look */}
      <div className="p-6 pb-4 flex justify-between items-center border-b border-transparent">
        <h2 className="font-sans text-lg font-bold text-[#1A1A1A] capitalize">
          {category === "all" ? "Recent Posts" : `${category} Posts`}
        </h2>
        <button className="text-slate-400 hover:text-slate-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
        {posts.map((post) => {
          const targetCat =
            category.toLowerCase() === "all"
              ? "all"
              : post.category || category;
          const href = `/${targetCat}/${post.slug}`;
          const isActive = post.id === selectedPostId;

          return (
            <li key={post.id}>
              <Link
                href={href}
                className={`block p-4 rounded-lg transition-all border ${
                  isActive
                    ? "bg-[#2D2D2D] border-[#2D2D2D]"
                    : "bg-white border-transparent hover:bg-[#FBF8F3] hover:border-[#E5E0D6]"
                }`}
              >
                {/* TITLE: Ensuring Sans-Serif here too */}
                <h3
                  className={`font-sans font-bold text-sm leading-snug ${
                    isActive ? "text-white" : "text-[#1A1A1A]"
                  }`}
                >
                  {post.title}
                </h3>
                <div
                  className={`text-[10px] uppercase tracking-wide font-medium mb-2 ${
                    isActive ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {post.date} <span className="mx-1">|</span> {post.category}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
