// components/CommentsLineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface CommentTimePoint {
  time: string; // "HH:MM"
  total: number;
  toxic: number;
  nonToxic: number;
}

interface CommentsLineChartProps {
  data: CommentTimePoint[];
}

export default function CommentsLineChart({ data }: CommentsLineChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[320px]">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 text-sm">
          Comment over time
        </h2>
        <span className="text-xs text-slate-500">
          Số lượng comment mỗi phút
        </span>
      </div>

      <div className="h-[260px] px-2 pt-3 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#64748b" }} // slate-500
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "#0f172a",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#6b7280" }} // gray-500
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#0f172a" // slate-900
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="toxic"
              name="Toxic"
              stroke="#ef4444" // red-500
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="nonToxic"
              name="Non-toxic"
              stroke="#22c55e" // green-500
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
