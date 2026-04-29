import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover flex items-center justify-center p-6"
style={{ 
  backgroundImage: "url('/images/couple-bg.jpeg')",
  backgroundPosition: "center 30%"
}}
      style={{ backgroundImage: "url('/images/couple-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-5">
        <Link href="/trivia">
          <button className="w-full rounded-2xl bg-white/90 px-6 py-5 text-xl font-bold text-black shadow-lg">
            טריוויה על החתן והכלה
          </button>
        </Link>

        <Link href="/upload">
          <button className="w-full rounded-2xl bg-white/90 px-6 py-5 text-xl font-bold text-black shadow-lg">
            תמונה לגלריית חתונה
          </button>
        </Link>

        <Link href="/gallery">
          <button className="w-full rounded-2xl bg-white/90 px-6 py-5 text-xl font-bold text-black shadow-lg">
            לצפייה בגלריית חתונה
          </button>
        </Link>
      </div>
    </main>
  );
}