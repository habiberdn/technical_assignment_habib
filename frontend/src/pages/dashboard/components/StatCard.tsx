import React from "react";
import { Users, ClipboardList, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import type { StatCardData } from "@/types/dashboard.types.js";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={18} />,
  calendar: <CalendarDays size={18} />,
  queue: <ClipboardList size={18} />,
  clock: <Clock size={18} />,
  check: <CheckCircle2 size={18} />,
};

interface StatCardProps {
  data: StatCardData;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const iconNode = iconMap[data.icon] || <ClipboardList size={18} />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{data.label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${data.iconBg} ${data.iconColor}`}>
          {iconNode}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className={`text-2xl font-bold ${data.valueColor ?? "text-gray-900"}`}>
          {typeof data.value === "number" ? data.value.toLocaleString("id-ID") : data.value}
        </p>
        {data.badge && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            {data.badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
