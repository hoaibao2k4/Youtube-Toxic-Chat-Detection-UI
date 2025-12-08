// components/HeroSearch.tsx
import React from "react";

interface HeroSearchProps {
  videoUrl: string;
  setVideoUrl: (v: string) => void;
  isCollecting: boolean;
  loading: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export default function HeroSearch({
  videoUrl,
  setVideoUrl,
  isCollecting,
  loading,
  error,
  onStart,
  onStop,
}: Readonly<HeroSearchProps>) {
  const containerClasses =
    "w-full flex flex-col items-center transition-all duration-500 transform " +
    (isCollecting ? "mt-6 scale-90" : "mt-[25vh] scale-100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCollecting) onStop();
    else onStart();
  };

  const hasError = Boolean(error);

  const inputClasses = [
    "flex-1 px-4 py-3 rounded-xl text-sm transition",
    "bg-white text-slate-900 placeholder:text-slate-400",
    "focus:outline-none",
    hasError
      ? "border border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
      : "border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  ].join(" ");

  return (
    <div className={containerClasses}>
      {/* Logo + title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-8 rounded-lg bg-red-600 shadow-lg">
          <span className="text-white text-xl font-bold">▶</span>
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            YouTube Live Comment Detection
          </h1>
          <p className="text-sm text-slate-500">
            Nhập link live stream để theo dõi toxic comment theo thời gian thực
          </p>
        </div>
      </div>

      {/* Input + button */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex gap-3 items-center"
      >
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Dán link YouTube live stream hoặc videoId..."
          className={inputClasses}
        />

        <button
          type="submit"
          disabled={loading || (!videoUrl && !isCollecting)}
          className={`px-5 py-3 rounded-xl text-sm font-medium transition cursor-pointer
            ${
              isCollecting
                ? "bg-red-600 hover:bg-red-600 text-white"
                : "bg-green-700 hover:bg-green-700 text-white"
            }
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {loading
            ? isCollecting
              ? "Đang dừng..."
              : "Đang bắt đầu..."
            : isCollecting
            ? "Dừng"
            : "Bắt đầu"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
