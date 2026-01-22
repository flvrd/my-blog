"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  categories?: string[];
}

export function Sidebar({ categories }: SidebarProps) {
  const safeCategories = categories || [];
  const pathname = usePathname();

  // State for the modal visibility
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  // State to toggle between 'bio' and 'contact' views
  const [modalView, setModalView] = useState<"bio" | "contact">("bio");
  // State for the sent button status
  const [isSent, setIsSent] = useState(false);

  // Helper to open modal to BIO view (and reset form state)
  const openModal = () => {
    setModalView("bio");
    setIsSent(false); // Reset button state
    setIsAboutOpen(true);
  };

  // Helper to open modal directly to CONTACT view (and reset form state)
  const openContact = () => {
    setModalView("contact");
    setIsSent(false); // Reset button state
    setIsAboutOpen(true);
  };

  // Helper to determine active state styling
  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(path + "/");
    return isActive
      ? "flex items-center gap-3 px-3 py-2 text-sm font-medium bg-[#2D2D2D] text-white rounded-md shadow-sm transition-all"
      : "flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#EAE6DF] rounded-md transition-all";
  };

  return (
    <>
      <nav className="flex flex-col h-full bg-[#FBF8F3] border-r border-[#E5E0D6] px-4 py-6 relative z-10">
        {/* 1. LOGO */}
        <div className=" px-2">
          <h1 className="font-sans-serif text-8xl font-bold tracking-wide text-[#0a0a0a]">
            A Blog
          </h1>
          <p className="text-sm text-slate-400 my-5">
            Ryan's musings about life, people, and everything in between.
          </p>
        </div>

        {/* 3. MAIN NAVIGATION */}
        <div className="space-y-1">
          {/* ABOUT ME BUTTON */}
          <button
            onClick={openModal}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#EAE6DF] rounded-md transition-all text-left"
          >
            About Me
          </button>

          {/* CONTACT ME BUTTON */}
          <button
            onClick={openContact}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#EAE6DF] rounded-md transition-all text-left"
          >
            Contact Me
          </button>
        </div>

        <Link href="/" className={getLinkClass("/")}>
          All Posts
        </Link>
        {/* 4. ARTICLES SECTION */}
        <div className="space-y-1 flex-1">
          <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">
            Categories
          </h3>
          {safeCategories.length === 0 ? (
            <div className="px-3 text-xs text-slate-400 italic">
              No categories
            </div>
          ) : (
            safeCategories.map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className={getLinkClass(`/${cat.toLowerCase()}`)}
              >
                <span className="capitalize">{cat}</span>
              </Link>
            ))
          )}
        </div>

        {/* 5. FOOTER (Theme Toggle) */}
        {/* <div className="pt-4 border-t border-[#E5E0D6] mt-4">
          <div className="flex bg-[#EAE6DF] p-1 rounded-lg">
            <button className="flex-1 text-[10px] font-semibold py-1 bg-white shadow-sm rounded text-slate-800">
              Light
            </button>
            <button className="flex-1 text-[10px] font-semibold py-1 text-slate-500 hover:text-slate-800">
              Dark
            </button>
            <button className="flex-1 text-[10px] font-semibold py-1 text-slate-500 hover:text-slate-800">
              Auto
            </button>
          </div>
        </div> */}
      </nav>

      {/* ABOUT ME MODAL OVERLAY */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FBF8F3] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-[#E5E0D6] relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5E0D6] flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                {modalView === "bio" ? "About Ryan" : "Get in Touch"}
              </h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-[#EAE6DF] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - SWITCHER */}
            <div className="p-6">
              {modalView === "bio" ? (
                // --- VIEW 1: BIO ---
                <div className="space-y-4 text-slate-600 leading-relaxed animate-in slide-in-from-left-4 duration-300">
                  <p>
                    Hi, I'm <strong>Ryan Johnson</strong>. I'm a UX Designer and
                    Product Manager based in Urbandale, Iowa.
                  </p>
                  <p>
                    I'm passionate about building intuitive products that solve
                    real problems. When I'm not designing, you'll likely find me
                    obsessing over architecture (especially Frank Lloyd Wright),
                    tinkering with my 3D printer, or chasing the perfect shot of
                    espresso.
                  </p>
                  <p>
                    I love traveling the world with my family—Jenny, Addie,
                    Cohen, and Soren—and hanging out with our cat, Morty.
                  </p>
                </div>
              ) : (
                // --- VIEW 2: CONTACT FORM ---
                <form
                  className="space-y-4 animate-in slide-in-from-right-4 duration-300"
                  onSubmit={(e) => {
                    e.preventDefault();

                    // 1. Get Values
                    const target = e.target as typeof e.target & {
                      email: { value: string };
                      message: { value: string };
                    };
                    const email = target.email.value;
                    const message = target.message.value;

                    // 2. Construct Mailto Link
                    const subject = "Inquiry";
                    const body = `From: ${email}\n\nMessage:\n${message}`;
                    const mailtoLink = `mailto:flvr.pill@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                    // 3. Open Email Client
                    window.location.href = mailtoLink;

                    // 4. Update UI State
                    setIsSent(true);
                  }}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1"
                    >
                      Your Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full bg-white border border-[#D6D3CC] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Hey Ryan, I wanted to chat about..."
                      className="w-full bg-white border border-[#D6D3CC] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder:text-slate-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSent}
                    className={`w-full py-2 text-sm font-bold rounded-md transition-all shadow-sm ${
                      isSent
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-[#2D2D2D] text-white hover:bg-black"
                    }`}
                  >
                    {isSent ? "Message Sent!" : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#EAE6DF]/30 border-t border-[#E5E0D6] flex justify-between items-center">
              {modalView === "bio" ? (
                <>
                  <button
                    onClick={() => {
                      setModalView("contact");
                      setIsSent(false);
                    }}
                    className="text-sm font-semibold text-[#2D2D2D] underline underline-offset-4 hover:text-black"
                  >
                    Contact Me
                  </button>
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    className="px-4 py-2 bg-white border border-[#D6D3CC] text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  {/* <button
                    onClick={() => setModalView("bio")}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    ← Back to Bio
                  </button> */}
                  <div />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
