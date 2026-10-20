interface KpiCardProps {
  title: string;
  value: number | string;
  loading?: boolean;
}

export function KpiCard({ title, value, loading }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-green-100" />
      ) : (
        <p className="mt-2 text-3xl font-bold text-[#1B4332]">{value}</p>
      )}
    </div>
  );
}
