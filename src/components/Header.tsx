import { useLocation } from "react-router-dom";
import { useHeaderAction } from "../contexts/HeaderActionContext";

const pageConfig: Record<
  string,
  {
    title: string;
    description: string;
    action?: {
      label: string;
      type: "menu" | "new-order" | "table";
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
    action: {
      label: "Tambah Meja",
      type: "table",
    },
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

  const { openMenuModal, openTableModal } = useHeaderAction();

  const currentPage = pageConfig[location.pathname] ?? {
    title: "Restaurant",
    description: "",
  };

  const handleAction = () => {
    if (currentPage.action?.type === "menu") {
      openMenuModal();
    } else if (currentPage.action?.type === "table") {
      openTableModal();
    }
  };

  return (
    <section className="min-h-[90px] w-full border-b-2 border-[#EAE4DC] bg-[#FFFEFB]">
      <div className="flex min-h-[90px] items-center justify-between gap-3 px-4 py-3 pl-20 sm:px-6 sm:pl-20 lg:px-8 lg:pl-8">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[#231812] sm:text-xl">
            {currentPage.title}
          </p>

          <p className="mt-1 text-xs font-medium text-[#806E60] sm:text-sm">
            {currentPage.description}
          </p>
        </div>

        {currentPage.action && (
          <button
            onClick={handleAction}
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#F3690E] px-3 text-xs font-semibold text-white transition hover:bg-orange-600 sm:min-w-[180px] sm:px-5 sm:text-sm"
          >
            + {currentPage.action.label}
          </button>
        )}
      </div>
    </section>
  );
}
