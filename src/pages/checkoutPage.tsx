import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer, Loader2, CheckCircle2 } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import { useNavigate, useParams } from "react-router-dom";

import { getOrderById, payOrder } from "../api/orderApi";
import OrderReceipt from "../components/OrderReceipt";

import type { Order } from "../types/Order";

const formatPrice = (price: number | string) => {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);

  const [amountReceived, setAmountReceived] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // =========================
  // FETCH ORDER
  // =========================

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getOrderById(Number(id));

        setOrder(data);

        // Jika order sudah dibayar,
        // otomatis isi uang diterima dari BE.
        if (data.amountReceived) {
          setAmountReceived(Number(data.amountReceived));
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);

        setError("Gagal mengambil data order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================
  // CALCULATION
  // =========================

  const total = useMemo(() => {
    if (!order) return 0;

    return Number(order.total);
  }, [order]);

  const change = useMemo(() => {
    return Math.max(amountReceived - total, 0);
  }, [amountReceived, total]);

  const isEnoughMoney = amountReceived >= total;

  // =========================
  // PAYMENT
  // =========================

  const handlePayment = async () => {
    if (!order) return;

    if (amountReceived < total) {
      setError("Uang yang diterima kurang dari total tagihan.");
      return;
    }

    try {
      setPaying(true);
      setError(null);

      const updatedOrder = await payOrder(order.id, amountReceived);

      setOrder(updatedOrder);
    } catch (err) {
      console.error("Failed to pay order:", err);

      setError("Pembayaran gagal. Silakan coba lagi.");
    } finally {
      setPaying(false);
    }
  };

  // =========================
  // QUICK MONEY
  // =========================

  const handleQuickAmount = (amount: number) => {
    setAmountReceived(amount);
    setError(null);
  };

  const handleExactAmount = () => {
    setAmountReceived(total);
    setError(null);
  };

  // =========================
  // BACK
  // =========================

  const handleBack = () => {
    navigate("/");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <div className="flex items-center gap-3 text-[#806E60]">
          <Loader2 size={22} className="animate-spin" />

          <span>Memuat order...</span>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR / NO ORDER
  // =========================

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FCFAF7]">
        <p className="text-[#806E60]">{error || "Order tidak ditemukan."}</p>

        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-xl border border-[#EAE4DC] bg-white px-5 py-3 font-medium text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>
      </div>
    );
  }

  const isPaid = order.status === "PAID";

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="border-b border-[#EAE4DC] bg-white px-4 py-5 sm:px-6 lg:px-12 lg:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#231812] sm:text-2xl">
              Checkout ORD-{order.id}
            </h1>

            <p className="text-[#806E60]">
              Meja {order.table.number} · {order.nameCustomer || "Pelanggan"} ·{" "}
              {order.source === "ADMIN" ? "Dine-in" : "Customer"}
            </p>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-xl border border-[#EAE4DC] bg-white px-5 py-3 font-medium text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="grid grid-cols-1 gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:gap-7 lg:px-12 lg:py-8 xl:grid-cols-[1fr_470px]">
        {/* ================================= */}
        {/* LEFT - ORDER DETAIL */}
        {/* ================================= */}

        <div className="rounded-3xl border-2 border-[#EAE4DC] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          {/* HEADER */}

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#231812]">
              Rincian tagihan
            </h2>

            <span className="rounded-full bg-[#FFF0DC] px-4 py-2 text-sm font-semibold text-[#231812]">
              {order.status === "PAID" ? "Paid" : "Served"}
            </span>
          </div>

          {/* ITEMS */}

          <div className="mt-8 space-y-5">
            {order.items.map((item) => (
              <div key={item.id} className="border-b border-[#EAE4DC] pb-5">
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="text-base text-[#231812]">
                      <span className="font-semibold text-[#F56600]">
                        {item.quantity}×
                      </span>{" "}
                      {item.menu.name}
                    </p>

                    <p className="mt-1 text-sm text-[#806E60]">
                      {formatPrice(item.price)} / porsi
                    </p>

                    {item.note && (
                      <p className="mt-2 text-xs text-[#806E60]">
                        Note: {item.note}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-base font-medium text-[#231812]">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <div className="mt-7 space-y-3">
            <div className="flex justify-between text-base text-[#806E60]">
              <span>Subtotal</span>

              <span>{formatPrice(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-base text-[#806E60]">
              <span>Service charge 10%</span>

              <span>{formatPrice(order.serviceCharge)}</span>
            </div>

            <div className="mt-4 flex justify-between text-xl font-bold text-[#F56600]">
              <span>Total tagihan</span>

              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* RIGHT - PAYMENT */}
        {/* ================================= */}

        <div className="h-fit rounded-3xl border-2 border-[#EAE4DC] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          {!isPaid ? (
            <>
              <h2 className="text-xl font-bold text-[#231812]">
                Pembayaran tunai
              </h2>

              {/* INPUT */}

              <div className="mt-7">
                <label className="mb-2 block text-base font-semibold text-[#231812]">
                  Uang diterima
                </label>

                <input
                  type="number"
                  min={0}
                  value={amountReceived === 0 ? "" : amountReceived}
                  onChange={(e) => {
                    setAmountReceived(Number(e.target.value));

                    setError(null);
                  }}
                  placeholder="0"
                  className="w-full rounded-xl border border-[#EAE4DC] px-4 py-3 text-lg outline-none shadow-sm focus:border-[#F56600] focus:ring-2 focus:ring-[#F56600]/10"
                />
              </div>

              {/* QUICK AMOUNT */}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleQuickAmount(50000)}
                  className="rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
                >
                  Rp 50.000
                </button>

                <button
                  onClick={() => handleQuickAmount(100000)}
                  className="rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
                >
                  Rp 100.000
                </button>

                <button
                  onClick={() => handleQuickAmount(150000)}
                  className="rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
                >
                  Rp 150.000
                </button>

                <button
                  onClick={() => handleQuickAmount(200000)}
                  className="rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
                >
                  Rp 200.000
                </button>

                <button
                  onClick={handleExactAmount}
                  className="rounded-xl border border-[#EAE4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
                >
                  Uang pas
                </button>
              </div>

              {/* CHANGE */}

              <div className="mt-7 rounded-2xl bg-[#FFEBD5] p-5">
                <p className="text-sm font-semibold text-[#A04400]">
                  Kembalian
                </p>

                <p className="mt-1 text-3xl font-bold text-[#9C3D00]">
                  {formatPrice(change)}
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* PAY */}

              <button
                onClick={handlePayment}
                disabled={paying || !isEnoughMoney}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F56600] px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#DD5A00] disabled:cursor-not-allowed disabled:bg-[#FDBA94]"
              >
                {paying ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Memproses pembayaran...
                  </>
                ) : (
                  "Bayar & tandai Paid"
                )}
              </button>
            </>
          ) : (
            /* ================================= */
            /* PAID STATE */
            /* ================================= */

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={25} className="text-green-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#231812]">
                    Pembayaran berhasil
                  </h2>

                  <p className="text-sm text-[#806E60]">
                    Order sudah ditandai sebagai Paid.
                  </p>
                </div>
              </div>

              {/* PAYMENT SUMMARY */}

              <div className="mt-7 rounded-2xl bg-[#FAF7F3] p-5">
                <div className="flex justify-between text-sm text-[#806E60]">
                  <span>Total tagihan</span>

                  <span>{formatPrice(order.total)}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-[#806E60]">
                  <span>Uang diterima</span>

                  <span>{formatPrice(order.amountReceived ?? 0)}</span>
                </div>

                <div className="mt-3 flex justify-between text-base font-bold text-[#F56600]">
                  <span>Kembalian</span>

                  <span>{formatPrice(order.changeAmount ?? 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {isPaid && (
        <div className="border-t border-[#EAE4DC] bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#231812]">Preview Nota</h2>

              <p className="mt-1 text-sm text-[#806E60]">
                Nota pembayaran untuk ORD-{order.id}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl border border-[#EAE4DC] bg-white px-5 py-3 font-medium text-[#231812] shadow-sm hover:bg-[#FAF7F3]"
            >
              <Printer size={18} />
              Print Nota
            </button>
          </div>

          <div className="flex justify-center overflow-x-auto rounded-2xl border border-[#EAE4DC] bg-[#F5F5F5] p-3 sm:p-6">
            <PDFViewer
              style={{
                width: "380px",
                height: "650px",
                border: "none",
              }}
            >
              <OrderReceipt order={order} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}
 
