import { useLocation } from "react-router-dom";
import { useHeaderAction } from "../contexts/HeaderActionContext";

const pageConfig: Record<
  string,
  {
    title: string;
    description: string;
    action?: {
      label: string;
      type: "menu" | "new-order";
    };
  }
> = {
  "/": {
    title: "Dashboard",
    description: "Ringkasan aktivitas restaurant",
  },

  "/active-orders": {
    title: "Active Orders",
    description: "Pesanan yang sedang berjalan di dapur dan siap di tagih",
    action: {
      label: "New Order",
      type: "new-order",
    },
  },

  "/new-order": {
    title: "New Order",
    description: "Buat pesanan baru untuk pelanggan",
  },

  "/table": {
    title: "Manajemen Meja",
    description: "Kelola meja dan ketersediaan meja restaurant",
  },

  "/menu": {
    title: "Manajemen Menu",
    description: "Kelola daftar menu, harga, dan ketersediaannya",
    action: {
      label: "Tambah Menu",
      type: "menu",
    },
  },
};

export default function Header() {
  const location = useLocation();

  const { openMenuModal } = useHeaderAction();

  const currentPage = pageConfig[location.pathname] ?? {
    title: "Restaurant",
    description: "",
  };

  const handleAction = () => {
    if (currentPage.action?.type === "menu") {
      openMenuModal();
    }
  };

  return (
    <section className="h-[90px] w-full border-b-2 border-[#EAE4DC] bg-[#FFFEFB]">
      <div className="flex items-center justify-between">
        <div className="container p-4">
          <p className="text-xl font-semibold text-[#231812]">
            {currentPage.title}
          </p>

          <p className="mt-1 text-sm font-medium text-[#806E60]">
            {currentPage.description}
          </p>
        </div>

        {currentPage.action && (
          <button
            onClick={handleAction}
            className="mr-10 flex h-10 items-center justify-center rounded-xl bg-[#F3690E] px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            + {currentPage.action.label}
          </button>
        )}
      </div>
    </section>
  );
}
