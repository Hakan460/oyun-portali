"use client";

import { useTema } from "./TemaSaglayici";

export default function TemaButonu() {
  const { tema, degistir } = useTema();

  return (
    <button
      onClick={degistir}
      className="px-3 py-1 rounded border dark:border-slate-600"
    >
      {tema === "acik" ? "🌙 Koyu" : "☀️ Açık"}
    </button>
  );
}
