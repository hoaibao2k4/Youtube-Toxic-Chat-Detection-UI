"use client";

import { useEffect, useMemo, useState } from "react";
import HeroSearch from "@/components/HeroSearch";
import CommentsTable from "@/components/CommentsTable";
import TopToxicUsers from "@/components/TopToxicUsers";
import CommentsLineChart, {
  CommentTimePoint,
} from "@/components/CommentsLineChart";
import {
  fetchUserComments,
  startCollecting,
  stopCollecting,
  UserComment,
} from "@/api/userCommentApi";

function extractVideoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v) return v;

    if (url.hostname.includes("youtu.be")) {
      const parts = url.pathname.split("/");
      const id = parts.filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // ignore parse error
  }

  return null;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // khi gõ lại URL thì clear error
  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    if (error) {
      setError(null);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    async function load() {
      try {
        const data = await fetchUserComments();
        setComments(data);
      } catch (err) {
        console.error("fetch user comments error", err);
      }
    }

    if (isCollecting) {
      load();
      intervalId = setInterval(load, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCollecting]);

  useEffect(() => {
    if (isCollecting) {
      const t = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(t);
    } else {
      setShowContent(false);
    }
  }, [isCollecting]);

  const handleStart = async () => {
    setError(null);
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      setError("Video URL / ID không hợp lệ. Hãy kiểm tra lại.");
      return;
    }

    setLoadingAction(true);
    try {
      await startCollecting(videoId);
      setIsCollecting(true);
    } catch (err) {
      console.error(err);
      setError("Không thể bắt đầu crawl dữ liệu. Kiểm tra lại backend.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleStop = async () => {
    setError(null);
    setLoadingAction(true);
    try {
      await stopCollecting();
    } catch (err) {
      console.error(err);
      setError("Không thể dừng collecting. Kiểm tra backend.");
    } finally {
      setIsCollecting(false);
      setComments([]);
      setLoadingAction(false);
    }
  };

  const lineData: CommentTimePoint[] = useMemo(() => {
    const buckets = new Map<
      string,
      { time: string; total: number; toxic: number; nonToxic: number }
    >();

    comments.forEach((c) => {
      const dt = new Date(c.published_at);
      if (Number.isNaN(dt.getTime())) return;

      const key = dt.toISOString().slice(11, 16); // HH:MM

      const existing =
        buckets.get(key) ||
        { time: key, total: 0, toxic: 0, nonToxic: 0 };

      existing.total += 1;
      if (c.pred_class === 1) existing.toxic += 1;
      else existing.nonToxic += 1;

      buckets.set(key, existing);
    });

    return Array.from(buckets.values()).sort((a, b) =>
      a.time.localeCompare(b.time),
    );
  }, [comments]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <HeroSearch
          videoUrl={videoUrl}
          setVideoUrl={handleVideoUrlChange}
          isCollecting={isCollecting}
          loading={loadingAction}
          error={error}
          onStart={handleStart}
          onStop={handleStop}
        />

        {showContent && (
          <main className="mt-10 pb-12 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CommentsLineChart data={lineData} />
              </div>
              <div className="xl:col-span-1">
                <TopToxicUsers comments={comments} />
              </div>
            </div>

            <CommentsTable comments={comments} />
          </main>
        )}
      </div>
    </div>
  );
}
