export default function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#eadfd6] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3 text-[#8b7768]">
        {icon}

        <span className="font-medium">
          {label}
        </span>
      </div>

      <p className="text-2xl font-bold text-[#2d211b]">
        {value}
      </p>
    </div>
  );
}