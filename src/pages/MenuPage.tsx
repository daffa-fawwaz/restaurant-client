import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, Utensils } from "lucide-react";

import {
  createMenu,
  deleteMenu,
  getMenus,
  updateAvailable,
  updateMenu,
} from "../api/menuApi";
import type { Menu } from "../types/Menu";

import MenuModal from "../components/menu/MenuModal.js";
import SummaryCard from "../components/menu/SummaryCard.js";
import { useHeaderAction } from "../contexts/HeaderActionContext";

interface MenuForm {
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  isAvailable: boolean;
}

const initialForm: MenuForm = {
  name: "",
  description: "",
  category: "Main",
  price: "",
  image: "",
  isAvailable: true,
};

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const [form, setForm] = useState<MenuForm>(initialForm);

  const { menuModalOpen, openMenuModal, closeMenuModal } = useHeaderAction();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMenus();

        setMenus(data);
        console.log(menus);
      } catch (error) {
        console.error("Failed to fetch menus:", error);

        setError("Gagal mengambil data menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const totalMenus = menus.length;

  const availableMenus = menus.filter((menu) => menu.isAvailable).length;

  const averagePrice =
    menus.length > 0
      ? menus.reduce((total, menu) => total + Number(menu.price), 0) /
        menus.length
      : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);

    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      category: menu.category,
      image: menu.image ?? "",
      isAvailable: menu.isAvailable,
    });

    openMenuModal();
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu) return;

    try {
      const updatedMenu = await updateMenu(editingMenu.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        isAvailable: form.isAvailable,
      });

      setMenus((prev) =>
        prev.map((menu) => (menu.id === editingMenu.id ? updatedMenu : menu)),
      );

      handleCloseModal();
    } catch (error) {
      console.error("Failed to update menu:", error);
      alert("Gagal mengupdate menu");
    }
  };

  const handleAddMenu = async () => {
    const name = form.name.trim();
    const category = form.category.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name) {
      alert("Nama menu wajib diisi");
      return;
    }

    if (!price || price <= 0) {
      alert("Harga menu harus lebih dari 0");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("isAvailable", String(form.isAvailable));

      if (form.image) {
        formData.append("image", form.image);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const newMenu = await createMenu(formData);

      setMenus((prev) => [...prev, newMenu]);

      handleCloseModal();
    } catch (err) {
      console.error("Failed to create menu:", err);
    }
  };

  const handleCloseModal = () => {
    closeMenuModal();

    setEditingMenu(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMenu) {
      await handleUpdateMenu();
      return;
    }

    await handleAddMenu();
  };

  /**
   * =========================
   * DELETE
   * =========================
   *
   * Untuk sekarang masih state lokal.
   * Nanti kita ganti DELETE API.
   */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus menu ini?",
    );

    if (!confirmed) return;

    try {
      await deleteMenu(id);

      setMenus((prev) => prev.filter((menu) => menu.id !== id));
    } catch (error) {
      console.error("Failed to delete menu:", error);
      alert("Gagal menghapus menu");
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      const updatedMenu = await updateAvailable(id);

      setMenus((prev) =>
        prev.map((menu) => (menu.id === id ? updatedMenu : menu)),
      );
    } catch (error) {
      console.error("Failed to update menu availability:", error);

      alert("Gagal mengubah ketersediaan menu");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <p className="text-[#8b7768]">Memuat data menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-red-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <SummaryCard
          icon={<Utensils size={20} />}
          label="Total menu"
          value={totalMenus}
        />

        <SummaryCard
          icon={<CheckCircle size={20} />}
          label="Tersedia"
          value={availableMenus}
        />

        <SummaryCard
          icon={<Utensils size={20} />}
          label="Rata-rata harga"
          value={formatPrice(averagePrice)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#eadfd6] bg-white shadow-sm">
        <table className="min-w-[850px] w-full">
          <thead>
            <tr className="border-b border-[#eadfd6] text-left text-[#8b7768]">
              <th className="px-5 py-4">ID</th>

              <th className="px-5 py-4">Menu</th>

              <th className="px-5 py-4">Harga</th>
              <th className="px-5 py-4">Kategori</th>

              <th className="px-5 py-4">Ketersediaan</th>

              <th className="px-5 py-4">Dibuat</th>

              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr
                key={menu.id}
                className="border-b border-[#eadfd6] last:border-none"
              >
                {/* ID */}

                <td className="px-5 py-4 text-[#8b7768]">{menu.id}</td>

                {/* MENU */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-[#2d211b]">
                        {menu.name}
                      </p>

                      <p className="mt-1 max-w-[300px] truncate text-sm text-[#8b7768]">
                        {menu.description || "-"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-medium text-[#2d211b]">
                  {formatPrice(menu.price)}
                </td>
                <td className="px-5 py-4 font-medium text-[#2d211b]">
                  {menu.category}
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggleAvailability(menu.id)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative h-5 w-10 rounded-full transition ${
                        menu.isAvailable ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow transition ${
                          menu.isAvailable ? "left-6" : "left-1"
                        }`}
                      />
                    </div>

                    <span
                      className={
                        menu.isAvailable ? "text-orange-500" : "text-[#8b7768]"
                      }
                    >
                      {menu.isAvailable ? "Tersedia" : "Tidak tersedia"}
                    </span>
                  </button>
                </td>

                {/* CREATED AT */}

                <td className="px-5 py-4 text-[#8b7768]">
                  {new Date(menu.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* ACTION */}

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditMenu(menu)}
                      className="rounded-xl border border-[#eadfd6] p-2.5 transition hover:bg-[#fff5ed]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="rounded-xl border border-[#eadfd6] p-2.5 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {menus.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-[#8b7768]"
                >
                  Belum ada menu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {menuModalOpen && (
        <MenuModal
          form={form}
          setForm={setForm}
          editingMenu={editingMenu}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
