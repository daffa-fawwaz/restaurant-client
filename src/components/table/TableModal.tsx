import { X } from "lucide-react";
import type { Table } from "../../types/Table";

interface TableForm {
  number: string;
  capacity: string;
  isAvailable: boolean;
}

interface TableModalProps {
  form: TableForm;
  setForm: React.Dispatch<React.SetStateAction<TableForm>>;
  editingTable: Table | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TableModal({
  form,
  setForm,
  editingTable,
  onClose,
  onSubmit,
}: TableModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingTable ? "Edit Meja" : "Tambah Meja"}
            </h2>

            <p className="mt-1 text-sm text-[#8b7768]">
              {editingTable ? "Ubah informasi meja." : "Tambahkan meja baru."}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold">Nomor meja</label>

            <input
              type="number"
              min={1}
              required
              value={form.number}
              onChange={(e) =>
                setForm({
                  ...form,
                  number: e.target.value,
                })
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Kapasitas</label>

            <input
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) =>
                setForm({
                  ...form,
                  capacity: e.target.value,
                })
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-semibold">Tersedia</p>
              <p className="text-sm text-gray-500">
                Meja bisa digunakan pelanggan
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  isAvailable: !form.isAvailable,
                })
              }
              className={`h-7 w-12 rounded-full ${
                form.isAvailable ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white transition ${
                  form.isAvailable ? "ml-6" : "ml-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border px-5 py-3 font-semibold sm:w-auto"
            >
              Batal
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white sm:w-auto"
            >
              {editingTable ? "Simpan perubahan" : "Tambah meja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
