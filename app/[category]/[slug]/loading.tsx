export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-12 bg-gray-500 rounded w-3/4"></div>

      {/* Meta Data Skeleton */}
      <div className="flex gap-4">
        <div className="h-4 bg-gray-500 rounded w-24"></div>
        <div className="h-4 bg-gray-500 rounded w-24"></div>
      </div>

      {/* Paragraph Skeletons */}
      <div className="space-y-3 pt-8">
        <div className="h-4 bg-gray-500 rounded w-full"></div>
        <div className="h-4 bg-gray-500 rounded w-full"></div>
        <div className="h-4 bg-gray-500 rounded w-5/6"></div>
      </div>
    </div>
  );
}
