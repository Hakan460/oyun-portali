import "./globals.css";
import Link from "next/link";
import TemaSaglayici from "./components/TemaSaglayici";
import TemaButonu from "./components/TemaButonu";

export const metadata = {
  title: "Oyun Portalı",
  description: "Oyun tanıtım sitesi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
        <TemaSaglayici>
          <nav className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <span className="text-lg font-bold">Oyun Portalı</span>
            <div className="flex items-center gap-6">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/oyunlar">Oyunlar</Link>
              <Link href="/hakkinda">Hakkında</Link>
              <TemaButonu />
            </div>
          </nav>
          {children}
        </TemaSaglayici>
      </body>
    </html>
  );
}
