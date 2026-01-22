import Image from "next/image";
import ReactMarkdown from "react-markdown"; // <--- Import the renderer
import { PostMetadata } from "@/lib/posts";

export function ArticleViewer({ post }: { post: PostMetadata }) {
  return (
    <div className="max-w-4xl mx-auto px-10 py-12 bg-white min-h-full">
      {/* META HEADER */}
      <div className="flex items-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-6">
        <time>{post.date}</time>
        <span className="mx-2">|</span>
        <span className="text-[#2D2D2D]">{post.category}</span>
      </div>

      {/* TITLE */}
      <h1 className="text-8xl md:text-5xl font-sans font-extrabold text-[#1A1A1A] leading-tight mb-6">
        {post.title}
      </h1>

      {/* SUBTITLE */}
      {post.subtitle && (
        <p className="text-xl text-slate-600 font-light leading-relaxed mb-10">
          {post.subtitle}
        </p>
      )}

      {/* FEATURED IMAGE */}
      {post.image && (
        <div className="relative w-full aspect-video mb-12 rounded-xl overflow-hidden bg-slate-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* --- CONTENT RENDERER (The Fix) --- */}
      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl">
        {post.content ? (
          <ReactMarkdown>{post.content}</ReactMarkdown>
        ) : (
          <p className="text-slate-400 italic">No content available</p>
        )}
      </div>
    </div>
  );
}
