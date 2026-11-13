"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TemaContext = createContext<{ tema: string; degistir: () => void } | null>(null);

export default function TemaSaglayici({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState("acik");

  // Tema değiştikçe <html> elemanına "dark" sınıfını ekle / çıkar
  useEffect(() => {
    const kok = document.documentElement;
    if (tema === "koyu") kok.classList.add("dark");
    else kok.classList.remove("dark");
  }, [tema]);

  const degistir = () => setTema(tema === "acik" ? "koyu" : "acik");

  return (
    <TemaContext.Provider value={{ tema, degistir }}>{children}</TemaContext.Provider>
  );
}

// Butonun kolayca kullanabilmesi için yardımcı hook
export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error("useTema, TemaSaglayici içinde kullanılmalı");
  return ctx;
}
