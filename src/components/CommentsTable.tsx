// components/CommentsTable.tsx
import { UserComment } from "@/api/userCommentApi";

interface CommentsTableProps {
  comments: UserComment[];
}

export default function CommentsTable({
  comments,
}: Readonly<CommentsTableProps>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 text-sm">Live comments</h2>
        <span className="text-xs text-slate-500">
          {comments.length} comment
        </span>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-slate-500 font-medium">
                User
              </th>
              <th className="px-4 py-2 text-left text-slate-500 font-medium w-1/2">
                Message
              </th>
              <th className="px-4 py-2 text-left text-slate-500 font-medium">
                Label
              </th>
              <th className="px-4 py-2 text-left text-slate-500 font-medium">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => {
              const label = c.pred_class === 1 ? "Toxic" : "Non-toxic";
              const badgeClass =
                c.pred_class === 1
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200";

              const dt = new Date(c.published_at);
              const timeString = dt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <tr
                  key={c._id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-2 text-slate-900 max-w-[180px] truncate">
                    {c.author}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{c.message}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
                    >
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-xs whitespace-nowrap">
                    {timeString}
                  </td>
                </tr>
              );
            })}

            {comments.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-400 text-sm"
                >
                  Chưa có comment nào…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}