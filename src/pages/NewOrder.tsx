import { useEffect, useMemo, useState } from "react";
import { getMenus } from "../api/menuApi";
import { getAllTable } from "../api/tableApi";
import { createOrder } from "../api/orderApi";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  note: string;
}

interface Table {
  id: number;
  number: number;
  capacity: number;
  isAvailable: boolean;
  createdAt: string;
}

interface OrderPayload {
  tableId: number;
  source: "ADMIN";
  nameCustomer: string;
  items: {
    menuId: number;
    quantity: number;
    note?: string;
  }[];
}

const formatPrice = (price: number) => {
  return `Rp ${price.toLocaleString("id-ID")}`;
};

export default function NewOrder() {
  const [customerName, setCustomerName] = useState("");

  const [orderType, setOrderType] = useState<"Walk-in" | "Dine-in">("Walk-in");

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Record<string, MenuItem[]>>([]);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [menuData, tableData] = await Promise.all([
          getMenus(),
          getAllTable(),
        ]);

        console.log("menus:", menuData);
        console.log("tables:", tableData);

        const groupedMenus = menuData.reduce(
          (acc: Record<string, MenuItem[]>, menu: MenuItem) => {
            if (!acc[menu.category]) {
              acc[menu.category] = [];
            }

            acc[menu.category].push(menu);

            return acc;
          },
          {},
        );

        setMenus(groupedMenus);


        setTables(tableData);

        const availableTable = tableData.find(
          (table: Table) => table.isAvailable,
        );

        if (availableTable) {
          setSelectedTableId(availableTable.id);
        }
      } catch (err) {
        console.error("Failed to fetch order data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = (menu: MenuItem) => {
    setOrderItems((current) => {
      const existing = current.find((item) => item.id === menu.id);

      if (existing) {
        return current.map((item) =>
          item.id === menu.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...menu,
          quantity: 1,
          note: "",
        },
      ];
    });
  };


  const removeItem = (menuId: number) => {
    setOrderItems((current) =>
      current
        .map((item) =>
          item.id === menuId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getQuantity = (menuId: number) => {
    return orderItems.find((item) => item.id === menuId)?.quantity ?? 0;
  };

  const updateItemNote = (menuId: number, note: string) => {
    setOrderItems((current) =>
      current.map((item) =>
        item.id === menuId
          ? {
              ...item,
              note,
            }
          : item,
      ),
    );
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [orderItems]);

  const serviceCharge = subtotal * 0.1;


  const total = subtotal + serviceCharge;

  // =========================
  // CREATE ORDER
  // =========================

  const handleCreateOrder = async () => {
    // =========================
    // VALIDATION
    // =========================

    if (!selectedTableId) {
      alert("Silakan pilih meja terlebih dahulu.");
      return;
    }

    if (orderItems.length === 0) {
      alert("Silakan pilih minimal satu menu.");
      return;
    }

    const payload: OrderPayload = {
      tableId: selectedTableId,
      source: "ADMIN",
      nameCustomer: customerName,

      items: orderItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,

        ...(item.note.trim()
          ? {
              note: item.note.trim(),
            }
          : {}),
      })),
    };

    console.log("Order payload:", payload);

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder(payload);

      console.log("Order created:", newOrder);

      console.log("Order successfully created:", payload);

      setOrderItems([]);
      setCustomerName("");
      toast.success("Orderan berhasil di buat")
    } catch (err) {
      console.error("Failed to create order:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFAF7]">
        <p className="text-[#806E60]">Memuat data...</p>
      </div>
    );
  }

  const availableTables = tables.filter((table) => table.isAvailable);

  return (
    <div className="min-h-screen bg-[#FCFAF7] p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-7">
          <section className="rounded-3xl border-2 border-[#EAE4DC] bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#231812]">
              Detail pelanggan
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:gap-5">
              {/* TABLE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#231812]">
                  Nomor meja
                </label>

                <select
                  value={selectedTableId ?? ""}
                  onChange={(e) => setSelectedTableId(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-[#EAE4DC] bg-white px-3 py-2 text-base text-[#231812] outline-none transition focus:border-[#F56600]"
                >
                  <option value="" disabled>
                    Pilih meja
                  </option>

                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Meja {table.number} — {table.capacity} orang
                    </option>
                  ))}
                </select>

                {availableTables.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    Tidak ada meja yang tersedia.
                  </p>
                )}
              </div>

              {/* CUSTOMER NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#231812]">
                  Nama pelanggan
                </label>

                <input
                  type="text"
                  placeholder="Opsional"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#EAE4DC] px-3 py-2 text-base outline-none placeholder:text-[#806E60] focus:border-[#F56600]"
                />
              </div>

              {/* ORDER TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#231812]">
                  Tipe
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType("Walk-in")}
                    className={`flex-1 rounded-xl px-3 py-2 font-medium transition sm:px-6 ${
                      orderType === "Walk-in"
                        ? "bg-[#F56600] text-white"
                        : "border-2 border-[#EAE4DC] bg-white text-[#231812]"
                    }`}
                  >
                    Walk-in
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType("Dine-in")}
                    className={`flex-1 rounded-xl px-3 py-2 font-medium transition sm:px-6 ${
                      orderType === "Dine-in"
                        ? "bg-[#F56600] text-white"
                        : "border-2 border-[#EAE4DC] bg-white text-[#231812]"
                    }`}
                  >
                    Dine-in
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================================= */}
          {/* MENUS */}
          {/* ================================= */}

          {Object.entries(menus).map(([category, items]) => (
            <section
              key={category}
              className="rounded-3xl border-2 border-[#EAE4DC] bg-white p-4 shadow-sm sm:p-6"
            >
              <h2 className="mb-5 text-lg font-semibold text-[#231812]">
                {category}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {items.map((menu) => {
                  const quantity = getQuantity(menu.id);

                  return (
                    <div
                      key={menu.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#EAE4DC] px-4 py-4 sm:px-5"
                    >
                      {/* MENU INFO */}

                      <div>
                        <p className="text-sm font-semibold text-[#231812]">
                          {menu.name}
                        </p>

                        <p className="text-sm text-[#806E60]">
                          {formatPrice(menu.price)}
                        </p>
                      </div>

                      {/* QUANTITY */}

                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => removeItem(menu.id)}
                          disabled={quantity === 0}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#EAE4DC] text-xl text-[#806E60] transition hover:bg-[#FAF7F3] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="w-4 text-center text-base text-[#231812]">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => addItem(menu)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F56600] text-xl text-white transition hover:bg-[#DD5A00]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border-2 border-[#EAE4DC] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[#231812]">
            Ringkasan pesanan
          </h2>

          {orderItems.length === 0 ? (
            <p className="mt-6 text-[#806E60]">Belum ada item dipilih.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#EAE4DC] p-3"
                >
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-medium text-[#231812]">
                      {item.quantity}× {item.name}
                    </span>

                    <span className="shrink-0 text-[#806E60]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => updateItemNote(item.id, e.target.value)}
                    placeholder="Catatan, contoh: ga pedes"
                    className="mt-3 w-full rounded-lg border border-[#EAE4DC] px-3 py-2 text-sm outline-none transition placeholder:text-[#A99A8E] focus:border-[#F56600]"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="my-6 border-t border-[#EAE4DC]" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#806E60]">
              <span>Subtotal</span>

              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-[#806E60]">
              <span>Service charge 10%</span>

              <span>{formatPrice(serviceCharge)}</span>
            </div>

            <div className="flex justify-between pt-1 text-lg font-bold text-[#F56600]">
              <span>Total</span>

              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={
              orderItems.length === 0 || !selectedTableId || isSubmitting
            }
            className="mt-7 w-full rounded-xl bg-[#F56600] px-5 py-3.5 font-semibold text-white transition hover:bg-[#DD5A00] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan & kirim ke dapur"}
          </button>
        </aside>
      </div>
    </div>
  );
}
