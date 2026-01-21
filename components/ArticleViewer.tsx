import Image from "next/image";
import { PostMetadata } from "@/lib/posts";

export function ArticleViewer({ post }: { post: PostMetadata }) {
  return (
    <div className="max-w-4xl mx-auto px-10 py-12 bg-white min-h-full">
      <div className="flex items-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-6">
        <time>{post.date}</time>
        <span className="mx-2">|</span>
        <span className="text-[#2D2D2D]">{post.category}</span>
      </div>

      {/* TITLE: Changed from font-serif to font-sans to match the reference */}
      <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-[#1A1A1A] leading-tight mb-6">
        {post.title}
      </h1>

      {post.subtitle && (
        <p className="text-xl text-slate-600 font-light leading-relaxed mb-10">
          {post.subtitle}
        </p>
      )}

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

      <div className="prose prose-slate max-w-none">
        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
          Watch it in action
        </h3>
        <p className="text-slate-600 leading-7">
          (Content rendering is currently handled by Notion properties. Connect
          your markdown renderer here to see full text.)
        </p>
      </div>
    </div>
  );
}
