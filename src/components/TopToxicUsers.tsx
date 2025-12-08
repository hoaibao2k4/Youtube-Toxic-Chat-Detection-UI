// components/TopToxicUsers.tsx
import { UserComment } from "@/api/userCommentApi";

interface TopToxicUsersProps {
  comments: UserComment[];
}

export default function TopToxicUsers({
  comments,
}: Readonly<TopToxicUsersProps>) {
  const toxicCounts: Record<string, number> = {};

  comments.forEach((c) => {
    if (c.pred_class === 1) {
      toxicCounts[c.author] = (toxicCounts[c.author] || 0) + 1;
    }
  });

  const ranking = Object.entries(toxicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900 text-sm">
          Top toxic users
        </h2>
        <p className="text-xs text-slate-500">
          Dựa trên số lượng comment toxic (label = 1)
        </p>
      </div>

      <div className="p-4 space-y-3">
        {ranking.length === 0 && (
          <p className="text-xs text-slate-400">Chưa có user toxic nào.</p>
        )}

        {ranking.map(([author, count], idx) => (
          <div
            key={author}
            className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold
                  ${
                    idx === 0
                      ? "bg-red-500 text-white"
                      : idx === 1
                      ? "bg-orange-500 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
              >
                #{idx + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-900 max-w-[140px] truncate">
                  {author}
                </span>
                <span className="text-[11px] text-slate-500">
                  {count} toxic comment
                  {count > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs text-red-600 font-medium">Toxic</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
