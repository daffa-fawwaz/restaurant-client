import { useState } from "react";
import { Pencil, Trash2, CheckCircle, Utensils } from "lucide-react";

import MenuModal from "../components/menu/MenuModal.js";
import SummaryCard from "../components/menu/SummaryCard.js";
import { useHeaderAction } from "../contexts/HeaderActionContext";

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

const initialForm: MenuForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  isAvailable: true,
};

const dummyMenus: Menu[] = [
  {
    id: 1,
    name: "Ayam Goreng",
    description: "Ayam goreng crispy dengan sambal",
    price: 12000,
    image: null,
    isAvailable: true,
    createdAt: "2026-07-01T09:00:00",
  },
  {
    id: 2,
    name: "Nasi Goreng",
    description: "Nasi goreng spesial dengan telur",
    price: 15000,
    image: null,
    isAvailable: true,
    createdAt: "2026-07-02T10:30:00",
  },
  {
    id: 3,
    name: "Ayam Panggang",
    description: "Ayam panggang dengan saus barbeque",
    price: 18000,
    image: null,
    isAvailable: false,
    createdAt: "2026-07-03T12:00:00",
  },
  {
    id: 4,
    name: "Iced Lemon Tea",
    description: "Teh lemon dingin yang menyegarkan",
    price: 8000,
    image: null,
    isAvailable: true,
    createdAt: "2026-07-04T14:20:00",
  },
  {
    id: 5,
    name: "Beef Burger",
    description: "Burger dengan beef patty dan sayuran",
    price: 22000,
    image: null,
    isAvailable: true,
    createdAt: "2026-07-05T16:40:00",
  },
];

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>(dummyMenus);

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const [form, setForm] = useState<MenuForm>(initialForm);

  const {
    menuModalOpen,
    openMenuModal,
    closeMenuModal,
  } = useHeaderAction();


  const totalMenus = menus.length;

  const availableMenus = menus.filter(
    (menu) => menu.isAvailable,
  ).length;

  const averagePrice =
    menus.length > 0
      ? menus.reduce((total, menu) => total + menu.price, 0) /
        menus.length
      : 0;


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };


  const handleAddMenu = () => {
    setEditingMenu(null);
    setForm(initialForm);

    openMenuModal();
  };


  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);

    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      image: menu.image ?? "",
      isAvailable: menu.isAvailable,
    });

    openMenuModal();
  };


  const handleCloseModal = () => {
    closeMenuModal();

    setEditingMenu(null);
    setForm(initialForm);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
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

    if (editingMenu) {
      setMenus((prev) =>
        prev.map((menu) =>
          menu.id === editingMenu.id
            ? {
                ...menu,
                name,
                description,
                price,
                image: form.image || null,
                isAvailable: form.isAvailable,
              }
            : menu,
        ),
      );
    }


    else {
      const newMenu: Menu = {
        id:
          menus.length > 0
            ? Math.max(...menus.map((menu) => menu.id)) + 1
            : 1,

        name,
        description,
        price,
        image: form.image || null,
        isAvailable: form.isAvailable,
        createdAt: new Date().toISOString(),
      };

      setMenus((prev) => [...prev, newMenu]);
    }

    handleCloseModal();
  };


  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus menu ini?",
    );

    if (!confirmed) return;

    setMenus((prev) =>
      prev.filter((menu) => menu.id !== id),
    );
  };


  const handleToggleAvailability = (id: number) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === id
          ? {
              ...menu,
              isAvailable: !menu.isAvailable,
            }
          : menu,
      ),
    );
  };

  return (
    <div className="p-8">

      <div className="mb-7 grid grid-cols-3 gap-5">
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


      <div className="overflow-hidden rounded-2xl border border-[#eadfd6] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#eadfd6] text-left text-[#8b7768]">
              <th className="px-5 py-4">
                ID
              </th>

              <th className="px-5 py-4">
                Menu
              </th>

              <th className="px-5 py-4">
                Harga
              </th>

              <th className="px-5 py-4">
                Ketersediaan
              </th>

              <th className="px-5 py-4">
                Dibuat
              </th>

              <th className="px-5 py-4 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr
                key={menu.id}
                className="border-b border-[#eadfd6] last:border-none"
              >

                <td className="px-5 py-4 text-[#8b7768]">
                  {menu.id}
                </td>

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


                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      handleToggleAvailability(menu.id)
                    }
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative h-5 w-10 rounded-full transition ${
                        menu.isAvailable
                          ? "bg-orange-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow transition ${
                          menu.isAvailable
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </div>

                    <span
                      className={
                        menu.isAvailable
                          ? "text-orange-500"
                          : "text-[#8b7768]"
                      }
                    >
                      {menu.isAvailable
                        ? "Tersedia"
                        : "Tidak tersedia"}
                    </span>
                  </button>
                </td>

                <td className="px-5 py-4 text-[#8b7768]">
                  {new Date(
                    menu.createdAt,
                  ).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>


                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        handleEditMenu(menu)
                      }
                      className="rounded-xl border border-[#eadfd6] p-2.5 transition hover:bg-[#fff5ed]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(menu.id)
                      }
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