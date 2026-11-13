import Link from "next/link";

export default function AnaSayfa() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Oyun Portalı</h1>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        Bağımsız oyunları keşfedin.
      </p>
      <Link
        href="/oyunlar"
        className="inline-block px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
      >
        Oyunlara göz at
      </Link>
    </main>
  );
}
