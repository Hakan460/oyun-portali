import OyunKarti from "../components/OyunKarti";

const oyunlar = [
  { id: 1, baslik: "Uzay Avcısı", tur: "Aksiyon" },
  { id: 2, baslik: "Bulmaca Krallığı", tur: "Bulmaca" },
  { id: 3, baslik: "Orman Koşusu", tur: "Platform" },
];

export default function OyunlarSayfasi() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Oyunlar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {oyunlar.map((oyun) => (
          <OyunKarti key={oyun.id} baslik={oyun.baslik} tur={oyun.tur} />
        ))}
      </div>
    </main>
  );
}
