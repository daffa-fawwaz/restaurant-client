import type { ReactNode } from "react";

interface ProgresCardProps {
  title: string;
  number: number | string;
  icon: ReactNode;
}

export default function ProgresCard({
  title,
  number,
  icon,
}: ProgresCardProps) {
  return (
    <div className="flex h-24 w-full items-center gap-4 rounded-2xl border-2 border-[#EAE4DC] bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5ED] text-[#F3690E]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-[#806E60]">
          {title}
        </p>

        <p className="mt-1 text-xl font-bold text-[#231812]">
          {number}
        </p>
      </div>
    </div>
  );
}
