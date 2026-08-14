import { useEffect, useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllOrder } from "../api/orderApi";
import type { Order } from "../types/Order";

type FilterStatus = "ALL" | "SERVED" | "PAID";

const formatPrice = (price: number | string) => {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<FilterStatus>("ALL");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /**
   * Fetch order berdasarkan filter status
   */
  const fetchOrders = async (
    filter: FilterStatus = activeFilter
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrder(
        filter === "ALL"
          ? undefined
          : {
              status: filter,
            }
      );

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Gagal mengambil data order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter]);

  /**
   * Search dilakukan di frontend
   *
   * Bisa mencari:
   * - ORD-5
   * - 5
   * - Meja 3
   * - nama customer
   */
  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId = `ord-${order.id}`.toLowerCase();

      const tableNumber = String(
        order.table?.number ?? ""
      ).toLowerCase();

      const customerName = (
        order.nameCustomer ?? "Walk-in"
      ).toLowerCase();

      return (
        orderId.includes(keyword) ||
        tableNumber.includes(keyword) ||
        customerName.includes(keyword)
      );
    });
  }, [orders, search]);

  /**
   * Total pembayaran dari order PAID
   */
  const totalPaid = orders
    .filter((order) => order.status === "PAID")
    .reduce(
      (total, order) => total + Number(order.total),
      0
    );

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      {/* HEADER */}
      <div className="border-b border-[#EAE4DC] bg-white px-4 py-6 sm:px-6 lg:px-12 lg:py-7">
        <h1 className="text-2xl font-bold text-[#231812] sm:text-3xl">
          Order History
        </h1>

        <p className="mt-1 text-[#806E60]">
          Hanya menampilkan pesanan berstatus Served dan Paid
        </p>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* FILTER */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* STATUS FILTER */}
            <div className="flex rounded-2xl border border-[#EAE4DC] bg-white p-1 shadow-sm">
              <FilterButton
                active={activeFilter === "ALL"}
                onClick={() => {
                  setActiveFilter("ALL");
                  setSearch("");
                }}
              >
                Semua
              </FilterButton>

              <FilterButton
                active={activeFilter === "SERVED"}
                onClick={() => {
                  setActiveFilter("SERVED");
                  setSearch("");
                }}
              >
                Served
              </FilterButton>

              <FilterButton
                active={activeFilter === "PAID"}
                onClick={() => {
                  setActiveFilter("PAID");
                  setSearch("");
                }}
              >
                Paid
              </FilterButton>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#806E60]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari order / meja / nama"
                className="h-12 w-full rounded-xl border border-[#EAE4DC] bg-white pl-11 pr-4 text-sm text-[#231812] outline-none shadow-sm transition focus:border-[#F56600] focus:ring-2 focus:ring-[#F56600]/10 sm:w-[320px] lg:w-[400px]"
              />
            </div>
          </div>

          {/* TOTAL PAID */}
          <div className="text-sm text-[#806E60]">
            Total terbayar:{" "}
            <span className="font-bold text-[#F56600]">
              {formatPrice(totalPaid)}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-[#EAE4DC] bg-white shadow-sm">
          {/* TABLE HEADER */}
          <div className="grid min-w-[1050px] grid-cols-[1.2fr_0.7fr_1.2fr_0.8fr_1.1fr_1.1fr_1.1fr_0.9fr_1fr] border-b border-[#EAE4DC] px-6 py-5 text-xs font-semibold uppercase tracking-wide text-[#806E60]">
            <div>Order</div>
            <div>Meja</div>
            <div>Pelanggan</div>
            <div>Item</div>
            <div>Subtotal</div>
            <div>Service 10%</div>
            <div>Total</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="px-6 py-12 text-center text-sm text-[#806E60]">
              Memuat order...
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-[#806E60]">
              {search
                ? "Order tidak ditemukan."
                : "Belum ada order."}
            </div>
          )}

          {/* ROWS */}
          {!loading &&
            filteredOrders.map((order) => (
              <OrderHistoryRow
                key={order.id}
                order={order}
                onCheckout={() =>
                  navigate(`/checkout/${order.id}`)
                }
                onInvoice={() =>
                  navigate(`/checkout/${order.id}`)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({
  active,
  onClick,
  children,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#F56600] text-white shadow-sm"
          : "text-[#806E60] hover:bg-[#FAF7F3]"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   ORDER ROW
========================================================= */

interface OrderHistoryRowProps {
  order: Order;
  onCheckout: () => void;
  onInvoice: () => void;
}

function OrderHistoryRow({
  order,
  onCheckout,
  onInvoice,
}: OrderHistoryRowProps) {
  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="grid min-w-[1050px] grid-cols-[1.2fr_0.7fr_1.2fr_0.8fr_1.1fr_1.1fr_1.1fr_0.9fr_1fr] items-center border-b border-[#EAE4DC] px-6 py-4 last:border-b-0">
      {/* ORDER */}
      <div>
        <p className="font-semibold text-[#231812]">
          ORD-{order.id}
        </p>

        <p className="text-xs text-[#806E60]">
          {formatTime(order.createdAt)}
        </p>
      </div>

      {/* TABLE */}
      <div className="text-sm text-[#231812]">
        {String(order.table.number).padStart(2, "0")}
      </div>

      {/* CUSTOMER */}
      <div className="text-sm text-[#231812]">
        {order.nameCustomer || "Walk-in"}
      </div>

      {/* ITEM */}
      <div className="text-sm text-[#806E60]">
        {itemCount} item
        {itemCount > 1 ? "s" : ""}
      </div>

      {/* SUBTOTAL */}
      <div className="text-sm text-[#231812]">
        {formatPrice(order.subtotal)}
      </div>

      {/* SERVICE */}
      <div className="text-sm text-[#231812]">
        {formatPrice(order.serviceCharge)}
      </div>

      {/* TOTAL */}
      <div className="text-sm font-bold text-[#231812]">
        {formatPrice(order.total)}
      </div>

      {/* STATUS */}
      <div>
        {order.status === "SERVED" ? (
          <span className="inline-flex rounded-full bg-[#FFF0DC] px-3 py-1.5 text-xs font-semibold text-[#A94800]">
            Served
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-[#E1F3E8] px-3 py-1.5 text-xs font-semibold text-[#16A05D]">
            Paid
          </span>
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        {order.status === "SERVED" && (
          <button
            onClick={onCheckout}
            className="rounded-xl bg-[#F56600] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#DD5A00]"
          >
            Checkout
          </button>
        )}

        {order.status === "PAID" && (
          <button
            onClick={onInvoice}
            className="flex items-center gap-2 rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm transition hover:bg-[#FAF7F3]"
          >
            <Printer size={17} />
            Invoice
          </button>
        )}
      </div>
    </div>
  );
}
