import Link from "next/link";
import { Fragment } from "react";

/**
 * Text Component: Handles bold, italic, code, underline, and links.
 */
const Text = ({ text }) => {
  if (!text) return null;
  return text.map((value, i) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        key={i}
        className={[
          bold ? "font-bold" : "",
          code
            ? "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm text-red-500"
            : "",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {value.href ? (
          <a
            href={value.href}
            className="underline text-blue-600 hover:opacity-70"
          >
            {text.content}
          </a>
        ) : (
          text.content
        )}
      </span>
    );
  });
};

/**
 * Color Mapper: Maps Notion colors to Tailwind classes.
 * We add dark mode backgrounds here so callouts don't look blindingly bright.
 */
const colorMap = {
  gray_background:
    "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
  brown_background:
    "bg-stone-100 border-stone-200 dark:bg-stone-800 dark:border-stone-700",
  orange_background:
    "bg-orange-50 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800",
  yellow_background:
    "bg-yellow-50 border-yellow-100 dark:bg-yellow-900/30 dark:border-yellow-800",
  green_background:
    "bg-green-50 border-green-100 dark:bg-green-900/30 dark:border-green-800",
  blue_background:
    "bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800",
  purple_background:
    "bg-purple-50 border-purple-100 dark:bg-purple-900/30 dark:border-purple-800",
  pink_background:
    "bg-pink-50 border-pink-100 dark:bg-pink-900/30 dark:border-pink-800",
  red_background:
    "bg-red-50 border-red-100 dark:bg-red-900/30 dark:border-red-800",
  default: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
};

/**
 * Main Block Renderer
 */
export const BlockRenderer = ({ block }) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4 text-gray-800 dark:text-gray-300 leading-relaxed">
          <Text text={value.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
          <Text text={value.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          <Text text={value.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">
          <Text text={value.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li className="mb-2 ml-4 text-gray-800 dark:text-gray-300">
          <Text text={value.rich_text} />
        </li>
      );

    case "to_do":
      return (
        <div className="flex gap-3 items-start mb-2">
          <div
            className={`mt-1 w-5 h-5 border rounded flex items-center justify-center ${value.checked ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"}`}
          >
            {value.checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={
              value.checked
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-300"
            }
          >
            <Text text={value.rich_text} />
          </span>
        </div>
      );

    case "callout":
      const colorClass = colorMap[value.color] || colorMap["default"];
      return (
        <div className={`p-4 rounded-lg flex gap-4 my-6 border ${colorClass}`}>
          {value.icon && <div className="text-2xl">{value.icon.emoji}</div>}
          <div className="text-gray-800 dark:text-gray-200 flex-1">
            <Text text={value.rich_text} />
          </div>
        </div>
      );

    case "video":
    case "embed":
      const url = value.url || value.external?.url;
      const isYoutube =
        url?.includes("youtube.com") || url?.includes("youtu.be");
      let embedUrl = url;
      if (isYoutube && url) {
        if (url.includes("watch?v="))
          embedUrl = `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
        if (url.includes("youtu.be/"))
          embedUrl = `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
      }

      return (
        <div className="w-full my-8 rounded-xl overflow-hidden shadow-lg aspect-video relative bg-black">
          <iframe
            src={embedUrl}
            title="Embedded Content"
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );

    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure className="my-10">
          <img
            src={src}
            alt={caption || "Article image"}
            className="w-full h-auto rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
          />
          {caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-900 dark:border-gray-100 pl-4 italic text-gray-700 dark:text-gray-300 my-6 text-lg">
          " <Text text={value.rich_text} /> "
        </blockquote>
      );

    case "divider":
      return (
        <hr className="my-8 border-t border-gray-200 dark:border-gray-800" />
      );

    default:
      return null;
  }
};

export default BlockRenderer;
