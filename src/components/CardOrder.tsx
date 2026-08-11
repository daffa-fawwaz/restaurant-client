import { Printer } from "lucide-react";

export default function CardOrder() {
  return (
    <div className="w-[340px] rounded-2xl border-2 border-[#EAE4DC] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#806E60]">WRG-1042 · 19:04</p>

          <h2 className="mt-1 text-xl font-semibold text-[#231812]">Meja 12</h2>

          <p className="text-sm text-[#806E60]">Rina · Dine-in</p>
        </div>

        <span className="shrink-0 rounded-full bg-[#FFF0DC] px-3 py-1.5 text-xs font-semibold text-[#231812]">
          In Progress
        </span>
      </div>

      <div className="my-5 border-t border-[#EAE4DC]" />

      <div className="space-y-2">
        <div className="flex justify-between gap-3">
          <p className="text-sm text-[#231812]">
            <span className="font-semibold text-[#F56600]">2×</span> Nasi Goreng
            Spesial
          </p>

          <p className="shrink-0 text-sm text-[#806E60]">Rp 90.000</p>
        </div>

        <div>
          <div className="flex justify-between gap-3">
            <p className="text-sm text-[#231812]">
              <span className="font-semibold text-[#F56600]">2×</span> Es Teh
              Manis
            </p>

            <p className="shrink-0 text-sm text-[#806E60]">Rp 24.000</p>
          </div>

          <p className="mt-1 text-xs text-[#806E60]">Note: Less sugar</p>
        </div>
      </div>

      <div className="my-5 border-t border-[#EAE4DC]" />

      {/* Summary */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-[#806E60]">
          <span>Subtotal</span>
          <span>Rp 114.000</span>
        </div>

        <div className="flex justify-between text-sm text-[#806E60]">
          <span>Service charge 10%</span>
          <span>Rp 11.400</span>
        </div>

        <div className="flex justify-between text-base font-bold text-[#F56600]">
          <span>Total</span>
          <span>Rp 125.400</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#EAE4DC] px-3 py-2.5 text-sm font-medium text-[#231812] shadow-sm hover:bg-[#FAF7F3]">
          <Printer size={18} />
          Print
        </button>

        <button className="flex-1 rounded-xl bg-[#F56600] px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#DD5A00]">
          Served
        </button>
      </div>
    </div>
  );
}
