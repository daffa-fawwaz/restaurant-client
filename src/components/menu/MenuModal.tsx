import { X } from "lucide-react";

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
  createdAt: string;
}

interface MenuForm {
  name: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
}

interface MenuModalProps {
  form: MenuForm;
  setForm: React.Dispatch<React.SetStateAction<MenuForm>>;
  editingMenu: Menu | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MenuModal({
  form,
  setForm,
  editingMenu,
  onClose,
  onSubmit,
}: MenuModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-xl">
        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2d211b]">
              {editingMenu
                ? "Edit Menu"
                : "Tambah Menu"}
            </h2>

            <p className="mt-1 text-sm text-[#8b7768]">
              {editingMenu
                ? "Ubah informasi menu."
                : "Tambahkan menu baru ke daftar."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8b7768] hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {/* NAME */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-[#2d211b]">
              Nama menu
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Contoh: Nasi Goreng Special"
              className="w-full rounded-xl border border-[#eadfd6] px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-[#2d211b]">
              Deskripsi
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Deskripsi menu..."
              className="w-full resize-none rounded-xl border border-[#eadfd6] px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* PRICE */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-[#2d211b]">
              Harga
            </label>

            <input
              type="number"
              min={1}
              required
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              placeholder="45000"
              className="w-full rounded-xl border border-[#eadfd6] px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* IMAGE */}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-[#2d211b]">
              URL gambar
            </label>

            <input
              type="text"
              value={form.image}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-[#eadfd6] px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* AVAILABLE */}

          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#eadfd6] p-4">
            <div>
              <p className="font-semibold text-[#2d211b]">
                Tersedia
              </p>

              <p className="text-sm text-[#8b7768]">
                Menu dapat dipesan pelanggan
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isAvailable: !prev.isAvailable,
                }))
              }
              className={`relative h-6 w-11 rounded-full transition ${
                form.isAvailable
                  ? "bg-orange-500"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  form.isAvailable
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* BUTTON */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#eadfd6] px-5 py-3 font-semibold text-[#2d211b] hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editingMenu
                ? "Simpan perubahan"
                : "Tambah menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}