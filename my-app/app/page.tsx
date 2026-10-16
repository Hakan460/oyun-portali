"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Gamepad2,
  Flame,
  Trophy,
  Search,
  Sparkles,
  Play,
  Star,
  Users,
  Compass,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Share2,
  ChevronRight,
  ShieldAlert,
  Award,
  Layers,
  Upload,
  Heart,
  CheckCircle2,
} from "lucide-react";

interface Game {
  id: string;
  title: string;
  tagline: string;
  category: "Aksiyon" | "Yarış" | "RPG" | "Uzay" | "Macera";
  image: string;
  rating: number;
  plays: string;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
  description: string;
}

const GAMES_DATA: Game[] = [
  {
    id: "cyber-strike",
    title: "Cyber Strike 2077",
    tagline: "Neon yağmurlu geleceğin savaş alanı",
    category: "Aksiyon",
    image: "/games/hero_cyber_strike.jpg",
    rating: 4.9,
    plays: "340K+",
    isFeatured: true,
    tags: ["Unity WebGL", "Ray Traced", "Çok Oyunculu"],
    description:
      "Siberpunk Tokyo sokaklarında geçen, yüksek tempolu 3D arena nişancı oyunu. Doğrudan tarayıcınızda 60 FPS akıcı deneyim.",
  },
  {
    id: "neon-drift",
    title: "Neon Drift: Tokyo Nights",
    tagline: "Işık hızında neon gece yarışları",
    category: "Yarış",
    image: "/games/game_neon_drift.jpg",
    rating: 4.8,
    plays: "215K+",
    isNew: true,
    tags: ["3D Fizik", "WebGL", "Liderlik Tablosu"],
    description:
      "Gelişmiş araç fiziği ve nefes kesen neon sokak pistleriyle gerçek zamanlı drift ve yarış simülasyonu.",
  },
  {
    id: "shadow-quest",
    title: "Shadow Quest",
    tagline: "Karanlık kaleler ve kadim büyüler",
    category: "RPG",
    image: "/games/game_shadow_quest.jpg",
    rating: 4.9,
    plays: "180K+",
    tags: ["Açık Dünya", "Dark Fantasy", "Boss Savaşları"],
    description:
      "Rünik kılıçlarınızla ejderha kalelerini fethedin. Zengin hikaye ve karakter geliştirme mekanikleri.",
  },
  {
    id: "space-odyssey",
    title: "Space Odyssey 3D",
    tagline: "Galaksiler arası it dalaşı simülasyonu",
    category: "Uzay",
    image: "/games/game_space_odyssey.jpg",
    rating: 4.7,
    plays: "142K+",
    tags: ["Uzay Simülasyonu", "60 FPS", "VR Uyumlu"],
    description:
      "Buz asteroitleri ve nebulalar arasında düşman filolarına karşı lazer savaşları verin.",
  },
  {
    id: "mystic-isles",
    title: "Mystic Isles: Whimsical Adventure",
    tagline: "Büyülü uçan adalar keşfi",
    category: "Macera",
    image: "/games/game_mystic_isles.jpg",
    rating: 4.8,
    plays: "98K+",
    isNew: true,
    tags: ["Platformer", "Aile Dostu", "3D Bulmaca"],
    description:
      "Sevimli robot yol arkadaşınızla gökyüzündeki gizemli tapınakları ve yüzen şelaleleri keşfe çıkın.",
  },
];

const LEADERBOARD = [
  { rank: 1, name: "SiberKurt_99", score: "142,500 XP", game: "Cyber Strike", badge: "Efsane" },
  { rank: 2, name: "NeonPilot_TR", score: "128,940 XP", game: "Neon Drift", badge: "Usta" },
  { rank: 3, name: "KaranlıkAvcı", score: "115,200 XP", game: "Shadow Quest", badge: "Elit" },
  { rank: 4, name: "CosmicVoid", score: "98,400 XP", game: "Space Odyssey", badge: "Pro" },
  { rank: 5, name: "HakanGamer", score: "89,150 XP", game: "Mystic Isles", badge: "Usta" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeGameModal, setActiveGameModal] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Mini Game State (Canvas Arcade Dodger)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [miniGameRunning, setMiniGameRunning] = useState<boolean>(false);
  const [miniGameScore, setMiniGameScore] = useState<number>(0);
  const [miniGameHighScore, setMiniGameHighScore] = useState<number>(0);
  const [miniGameOver, setMiniGameOver] = useState<boolean>(false);

  // Filter games based on search and category
  const filteredGames = GAMES_DATA.filter((game) => {
    const matchesCategory =
      selectedCategory === "Tümü" || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Tümü", "Aksiyon", "Yarış", "RPG", "Uzay", "Macera"];

  // Open game modal with smooth loading bar simulation
  const handleLaunchGame = (game: Game) => {
    setActiveGameModal(game);
    setLoadingGame(true);
    setLoadProgress(15);
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingGame(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mini canvas retro dodger game implementation
  useEffect(() => {
    if (!miniGameRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let playerX = canvas.width / 2;
    const playerY = canvas.height - 35;
    const playerSize = 22;
    let score = 0;
    let isGameOver = false;

    // Obstacles
    let obstacles: { x: number; y: number; size: number; speed: number; color: string }[] = [];
    let crystals: { x: number; y: number; size: number; speed: number }[] = [];

    let moveLeft = false;
    let moveRight = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      playerX = Math.max(playerSize, Math.min(canvas.width - playerSize, mouseX));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;
      ctx.fillStyle = "#090c15";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Handle player movement
      if (moveLeft && playerX > playerSize) playerX -= 7;
      if (moveRight && playerX < canvas.width - playerSize) playerX += 7;

      // Spawn obstacle
      if (frameCount % 24 === 0) {
        obstacles.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          size: Math.random() * 12 + 14,
          speed: Math.random() * 2.5 + 3.5,
          color: Math.random() > 0.5 ? "#f43f5e" : "#e11d48",
        });
      }

      // Spawn crystal
      if (frameCount % 45 === 0) {
        crystals.push({
          x: Math.random() * (canvas.width - 25) + 12,
          y: -20,
          size: 10,
          speed: 3,
        });
      }

      // Update & Draw Crystals
      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.y += c.speed;

        ctx.fillStyle = "#06b6d4";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Check collection
        const dist = Math.hypot(playerX - c.x, playerY - c.y);
        if (dist < playerSize + c.size) {
          crystals.splice(i, 1);
          score += 50;
          setMiniGameScore((s) => s + 50);
          continue;
        }

        if (c.y > canvas.height + 20) {
          crystals.splice(i, 1);
        }
      }

      // Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.y += o.speed;

        ctx.fillStyle = o.color;
        ctx.shadowColor = o.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Check collision
        const dist = Math.hypot(playerX - o.x, playerY - o.y);
        if (dist < playerSize / 1.5 + o.size) {
          isGameOver = true;
          break;
        }

        if (o.y > canvas.height + 30) {
          obstacles.splice(i, 1);
          score += 10;
          setMiniGameScore((s) => s + 10);
        }
      }

      // Draw Player Space Fighter
      ctx.save();
      ctx.translate(playerX, playerY);
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;

      // Spaceship triangle
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(0, -playerSize);
      ctx.lineTo(playerSize, playerSize);
      ctx.lineTo(0, playerSize * 0.5);
      ctx.lineTo(-playerSize, playerSize);
      ctx.closePath();
      ctx.fill();

      // Jet flame
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-6, playerSize * 0.7);
      ctx.lineTo(6, playerSize * 0.7);
      ctx.lineTo(0, playerSize + (frameCount % 4) * 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (!isGameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      } else {
        setMiniGameOver(true);
        setMiniGameRunning(false);
        setMiniGameHighScore((prev) => Math.max(prev, score));
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [miniGameRunning]);

  const startMiniGame = () => {
    setMiniGameScore(0);
    setMiniGameOver(false);
    setMiniGameRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Background Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#08090d]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  PORTAL<span className="text-cyan-400">X</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  WebGL 60 FPS
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Unity WebGL & 3D Oyun Platformu
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Oyun, kategori veya etiket ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121622]/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Temizle
                </button>
              )}
            </div>
          </div>

          {/* Actions & Player Status */}
          <div className="flex items-center gap-3">
            {/* Live Players Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4,820 Çevrimiçi</span>
            </div>

            {/* Daily Reward Button */}
            <button
              onClick={() => setDailyRewardClaimed(true)}
              disabled={dailyRewardClaimed}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dailyRewardClaimed
                  ? "bg-zinc-800/80 text-zinc-400 cursor-default"
                  : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 shadow-md shadow-amber-500/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {dailyRewardClaimed ? "Ödül Alındı (+250 XP)" : "Günlük Ödül (+250 XP)"}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[2px]">
                <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center text-sm font-bold text-cyan-300">
                  HÜ
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-zinc-200">Hakan Üzer</div>
                <div className="text-[10px] font-medium text-cyan-400">Level 18 • Elit Gamer</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* HERO SECTION - FEATURED GAME */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 group">
          <div className="relative w-full h-[420px] sm:h-[480px]">
            <Image
              src="/games/hero_cyber_strike.jpg"
              alt="Cyber Strike 2077"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/80 to-transparent w-full md:w-2/3" />
          </div>

          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> GÜNÜN ÖNE ÇIKANI
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Unity WebGL
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Ray Traced 60 FPS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight drop-shadow-md">
              CYBER STRIKE 2077
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 mb-6 line-clamp-2 sm:line-clamp-3 max-w-xl font-normal leading-relaxed">
              Siberpunk Tokyo gökdelenlerinde ve karanlık sokaklarında geçen, yüksek tempolu 3D arena nişancı oyunu. Doğrudan tarayıcınızda kurulumsuz ve ücretsiz oynayın.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleLaunchGame(GAMES_DATA[0])}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" />
                HEMEN OYNA
              </button>

              <button
                onClick={() => handleLaunchGame(GAMES_DATA[0])}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-sm border border-white/15 transition-all"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                Oyun Detayları
              </button>

              <div className="flex items-center gap-4 ml-auto text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-zinc-100 font-bold">4.9</span> (14.2k Oy)
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-100 font-bold">340K+</span> Oynandı
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY SELECTOR & QUICK TABS */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                    : "bg-[#121622] text-zinc-400 hover:text-white hover:bg-[#1a2030] border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs text-zinc-400">
            <span>Toplam {filteredGames.length} Oyun Listeleniyor</span>
          </div>
        </section>

        {/* GAMES GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Popüler & Yeni Oyunlar
            </h2>
          </div>

          {filteredGames.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#121622]/50 border border-white/5">
              <ShieldAlert className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-zinc-300">Aramanıza uygun oyun bulunamadı</h3>
              <p className="text-sm text-zinc-500 mt-1">Farklı bir arama terimi veya kategori deneyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleLaunchGame(game)}
                  className="group relative rounded-2xl overflow-hidden bg-[#101420] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col cursor-pointer"
                >
                  {/* Card Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101420] via-transparent to-black/30" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {game.category}
                      </span>
                      {game.isNew && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-md">
                          YENİ
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(game.id, e)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all hover:scale-110"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(game.id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      />
                    </button>

                    {/* Hover Play Overlay */}
                    <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-400/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                        <span className="flex items-center gap-1 font-semibold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {game.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-zinc-400" />
                          {game.plays}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Tags & Action */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {game.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Oyna <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* INTERACTIVE MINI-GAME SECTION (CANVAS ARCADE DODGER) */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121625] via-[#0d101a] to-[#0a0d16] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="max-w-lg space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Doğrudan Sayfada Oyna
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                NEON SPACE DODGER
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Yükleme yapmadan hemen oyna! Siber asteroitlerden kaçın, enerji kristallerini topla ve yüksek skor yaparak haftalık liderlik tablosuna adını yazdır.
              </p>

              <div className="flex items-center gap-6 text-sm text-zinc-300">
                <div>
                  <span className="text-xs text-zinc-500 block">Şu Anki Skor</span>
                  <span className="text-2xl font-black text-cyan-400">{miniGameScore}</span>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <span className="text-xs text-zinc-500 block">En Yüksek Skor</span>
                  <span className="text-2xl font-black text-amber-400">{miniGameHighScore}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {!miniGameRunning ? (
                  <button
                    onClick={startMiniGame}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    {miniGameOver ? "Tekrar Dene" : "Mini Oyunu Başlat"}
                  </button>
                ) : (
                  <button
                    onClick={() => setMiniGameRunning(false)}
                    className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-bold text-sm"
                  >
                    Oyunu Durdur
                  </button>
                )}

                <span className="text-xs text-zinc-400 font-medium">
                  Kontroller: ⌨️ [A / D] veya [Yön Tuşları] ya da 🖱️ [Fare Hareketi]
                </span>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl bg-[#090c15] w-full max-w-[480px] h-[300px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={480}
                height={300}
                className="w-full h-full cursor-crosshair"
              />

              {!miniGameRunning && !miniGameOver && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Gamepad2 className="w-12 h-12 text-cyan-400 animate-bounce" />
                  <h4 className="text-lg font-bold text-white">Neon Space Dodger</h4>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Oyunu başlat butonuna basarak gemiyi kontrol edin ve engelleri atlatın!
                  </p>
                  <button
                    onClick={startMiniGame}
                    className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all shadow-md"
                  >
                    Başla
                  </button>
                </div>
              )}

              {miniGameOver && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <span className="text-rose-500 font-black text-xl">OYUN BİTTİ!</span>
                  <p className="text-xs text-zinc-300">
                    Skorun: <span className="text-cyan-400 font-bold">{miniGameScore}</span>
                  </p>
                  <button
                    onClick={startMiniGame}
                    className="mt-2 px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all shadow-md"
                  >
                    Yeniden Oyna
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COMMUNITY LEADERBOARD & DEVELOPER SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard Column */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-[#101420] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Haftalık Şampiyonlar Tablosu
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  En yüksek puanı toplayan oyuncular her hafta özel rozetler ve ödüller kazanır.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Sezon 4
              </span>
            </div>

            <div className="space-y-3">
              {LEADERBOARD.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        player.rank === 1
                          ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                          : player.rank === 2
                          ? "bg-zinc-300 text-black"
                          : player.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {player.rank}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        {player.name}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {player.badge}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">{player.game}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-400">{player.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unity Developer Spotlight */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Kendi Unity Oyununu Yayınla</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Geliştirdiğin Unity WebGL build dosyasını hemen portala yükle, binlerce aktif oyuncuya anında ulaş ve geri bildirim topla.
              </p>
              <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Doğrudan WebGL export desteği
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Otomatik optimizasyon & CDN dağıtımı
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Gerçek zamanlı oyuncu analitiği
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert("Unity WebGL Geliştirici Yükleme Paneli yakında aktif olacaktır!")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all"
            >
              Geliştirici Başvurusu Yap
            </button>
          </div>
        </section>
      </main>

      {/* GAME PLAY LAUNCH MODAL */}
      {activeGameModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e111a] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#121622]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeGameModal.title}</h3>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span>{activeGameModal.category}</span>
                    <span>•</span>
                    <span className="text-cyan-400">Unity WebGL 60 FPS</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioMuted(!audioMuted)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                >
                  {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveGameModal(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Game Canvas Simulation */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {loadingGame ? (
                <div className="flex flex-col items-center space-y-4 p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center">
                    <Gamepad2 className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Unity WebGL Yükleniyor...</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Grafik motoru başlatılıyor, shaderlar derleniyor (% {loadProgress})
                    </p>
                  </div>
                  <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 rounded-full"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <Image
                    src={activeGameModal.image}
                    alt={activeGameModal.title}
                    fill
                    className="object-cover opacity-60 filter blur-xs"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center space-y-4 p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Oyun Hazır • 60 FPS
                    </div>
                    <h3 className="text-2xl font-black text-white">{activeGameModal.title}</h3>
                    <p className="text-xs text-zinc-300 max-w-md mx-auto">
                      Oyun oturumu başlatıldı. Tam ekran moduna geçerek oyun kumandası veya klavye ile oynayabilirsiniz.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => alert("Tam ekran modu aktif edildi!")}
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                      >
                        <Maximize2 className="w-4 h-4" /> Tam Ekran Başlat
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer & Controls Guide */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#101420] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-zinc-300">Kontroller:</span>
                <span className="px-2 py-1 rounded bg-white/5 text-zinc-300 font-mono">W, A, S, D</span>
                <span>Hareket</span>
                <span className="px-2 py-1 rounded bg-white/5 text-zinc-300 font-mono">Space</span>
                <span>Zıpla / Ateş</span>
                <span className="px-2 py-1 rounded bg-white/5 text-zinc-300 font-mono">Fare</span>
                <span>Nişan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Oyun bağlantısı panoya kopyalandı!")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  <Share2 className="w-3.5 h-3.5" /> Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#07080b] py-12 mt-16 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">PORTAL X</span>
              <p className="text-[11px] text-zinc-500">© 2026 Oyun Portalı • Hakan Üzer. Tüm hakları saklıdır.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <a href="#games" className="hover:text-white transition-colors">Oyunlar</a>
            <a href="#categories" className="hover:text-white transition-colors">Kategoriler</a>
            <a href="#leaderboard" className="hover:text-white transition-colors">Liderlik Tablosu</a>
            <a href="#developers" className="hover:text-white transition-colors">Geliştiriciler</a>
            <a href="#privacy" className="hover:text-white transition-colors">Gizlilik & Şartlar</a>
          </div>

          <div className="flex items-center gap-2 text-zinc-500">
            <span>Unity WebGL Entegrasyonuyla Güçlendirilmiştir</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
