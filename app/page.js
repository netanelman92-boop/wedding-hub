import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover flex items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url('/images/home-bg.jpeg')",
        backgroundPosition: "center 30%",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-5">
        <Link href="/trivia">
          <button className="w-full rounded-2xl bg-white/90 px-5 py-3 text-base font-bold text-black shadow-lg active:scale-95 transition">
            טריוויה על החתן והכלה
          </button>
        </Link>

        <Link href="/upload">
          <button className="w-full rounded-2xl bg-white/90 px-5 py-3 text-base font-bold text-black shadow-lg active:scale-95 transition">
            תמונה לגלריית חתונה
          </button>
        </Link>

        <Link href="/gallery">
          <button className="w-full rounded-2xl bg-white/90 px-5 py-3 text-xl font-bold text-black shadow-lg active:scale-95 transition">
            לצפייה בגלריית חתונה
          </button>
        </Link>
      </div>
    </main>
  );
}