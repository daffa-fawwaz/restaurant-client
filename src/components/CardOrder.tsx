import { Printer, RotateCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";

import { changeStatusOrder } from "../api/orderApi";
import OrderReceipt from "./OrderReceipt";

import type { Order } from "../types/Order";

interface CardOrderProps {
  order: Order;
  onStatusChanged: (orderId: number, status: Order["status"]) => void;
}

const formatPrice = (price: number | string) => {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";

    case "SERVED":
      return "Served";

    case "PAID":
      return "Paid";

    default:
      return status;
  }
};

export default function CardOrder({ order, onStatusChanged }: CardOrderProps) {
  const navigate = useNavigate();

  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * IN_PROGRESS -> SERVED
   */
  const handleServed = async () => {
    try {
      setLoading(true);

      const updatedOrder = await changeStatusOrder(order.id, "SERVED");

      onStatusChanged(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error("Failed to change order status:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * SERVED -> IN_PROGRESS
   *
   * Digunakan untuk mengatasi human error.
   */
  const handleBackToProgress = async () => {
    try {
      setLoading(true);

      const updatedOrder = await changeStatusOrder(order.id, "IN_PROGRESS");

      onStatusChanged(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error("Failed to revert order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate(`/checkout/${order.id}`);
  };

  const handlePrint = () => {
    setShowReceipt(true);
  };

  return (
    <>
      {/* CARD ORDER */}
      <div className="w-full min-w-0 rounded-2xl border-2 border-[#EAE4DC] bg-white p-5 shadow-sm">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#806E60]">
              ORD-{order.id} · {formatTime(order.createdAt)}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#231812]">
              Meja {order.table.number}
            </h2>

            <p className="text-sm text-[#806E60]">
              {order.nameCustomer || "Pelanggan"} ·{" "}
              {order.source === "ADMIN" ? "Dine-in" : "Customer"}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-[#FFF0DC] px-3 py-1.5 text-xs font-semibold text-[#231812]">
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="my-5 border-t border-[#EAE4DC]" />

        {/* ITEMS */}
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between gap-3">
                <p className="text-sm text-[#231812]">
                  <span className="font-semibold text-[#F56600]">
                    {item.quantity}×
                  </span>{" "}
                  {item.menu.name}
                </p>

                <p className="shrink-0 text-sm text-[#806E60]">
                  {formatPrice(Number(item.price) * item.quantity)}
                </p>
              </div>

              {item.note && (
                <p className="mt-1 text-xs text-[#806E60]">Note: {item.note}</p>
              )}
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-[#EAE4DC]" />

        {/* SUMMARY */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-[#806E60]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm text-[#806E60]">
            <span>Service charge 10%</span>
            <span>{formatPrice(order.serviceCharge)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-[#F56600]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {/* PRINT */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex min-w-[110px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#EAE4DC] px-3 py-2.5 text-sm font-medium text-[#231812] shadow-sm transition hover:bg-[#FAF7F3]"
          >
            <Printer size={18} />
            Print
          </button>

          {/* IN PROGRESS */}
          {order.status === "IN_PROGRESS" && (
            <button
              type="button"
              onClick={handleServed}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#F56600] px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#DD5A00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "Served"}
            </button>
          )}

          {/* SERVED */}
          {order.status === "SERVED" && (
            <>
              {/* REVERT */}
              <button
                type="button"
                onClick={handleBackToProgress}
                disabled={loading}
                title="Kembalikan ke In Progress"
                className="flex items-center justify-center rounded-xl border border-[#EAE4DC] px-3 py-2.5 text-[#806E60] transition hover:bg-[#FAF7F3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={18} />
              </button>

              {/* CHECKOUT */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 rounded-xl bg-[#F56600] px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#DD5A00] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#EAE4DC] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#231812]">
                  Preview Nota
                </h2>

                <p className="text-sm text-[#806E60]">ORD-{order.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#806E60] transition hover:bg-[#FAF7F3]"
              >
                <X size={20} />
              </button>
            </div>

            {/* PDF */}
            <div className="flex-1 bg-[#EAEAEA]">
              <PDFViewer width="100%" height="100%" showToolbar>
                <OrderReceipt order={order} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
