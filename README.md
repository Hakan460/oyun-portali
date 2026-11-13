# Oyun Portalı — Hafta 6 (Tailwind CSS)

Next.js (App Router) + Tailwind CSS ile responsive ve dark mode destekli oyun tanıtım sitesi.

## Çalıştırma
```bash
npm install
npm run dev
```
http://localhost:3000 adresini açın.

## Yapı
- `app/layout.tsx` — flex menü + tema sağlayıcı
- `app/oyunlar/page.tsx` — responsive grid (1 / 2 / 3 sütun)
- `app/components/OyunKarti.tsx` — yeniden kullanılabilir kart bileşeni
- `app/components/TemaSaglayici.tsx`, `TemaButonu.tsx` — dark mode (context)
- `tailwind.config.js` — `darkMode: "class"`
