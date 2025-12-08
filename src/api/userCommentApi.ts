// lib/api/comments.ts
import { api } from "@/service/axios";
export interface RawUserComment {
  _id: string;
  author: string;
  message: string;
  clean_text?: string;
  published_at: string;
  pred_class?: number;
  label?: number;
}

export interface UserComment {
  _id: string;
  author: string;
  message: string;
  published_at: string;
  pred_class: number; // 0/1
}

export async function startCollecting(videoId: string) {
  const res = await api.post("/api/start-collecting", { videoId });
  return res.data;
}

export async function stopCollecting() {
  const res = await api.delete("/api/stop-collecting");
  return res.data;
}

export async function fetchUserComments(): Promise<UserComment[]> {
  const res = await api.get<RawUserComment[]>("/api/user-comments");
  const raw = res.data ?? [];

  // Chuẩn hóa dữ liệu về cùng 1 kiểu
  return raw.map((c) => ({
    _id: c._id,
    author: c.author,
    message: c.message ?? c.clean_text ?? "",
    published_at: c.published_at,
    pred_class: typeof c.pred_class === "number" ? c.pred_class : c.label ?? 0,
  }));
}
