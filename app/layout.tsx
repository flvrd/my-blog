import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getUniqueCategories } from "@/lib/posts";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getUniqueCategories();

  return (
    <html lang="en">
      {/* CRITICAL: 
        1. 'flex' makes the Sidebar and Content sit side-by-side.
        2. 'h-screen' ensures the app fills the viewport.
        3. 'overflow-hidden' prevents the whole page from scrolling (we scroll columns instead).
      */}
      <body className="flex h-screen w-screen overflow-hidden text-slate-900">
        {" "}
        {/* LEFT COLUMN: Sidebar (Fixed Width) */}
        <div className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto z-10">
          <Sidebar categories={categories} />
        </div>
        {/* RIGHT AREA: The Page Content (Takes remaining width) */}
        <div className="flex-1 h-full overflow-hidden relative">{children}</div>
      </body>
    </html>
  );
}
