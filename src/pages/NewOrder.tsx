import { useMemo, useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const menus = {
  Main: [
    { id: 1, name: "Nasi Goreng Spesial", price: 45000 },
    { id: 2, name: "Ayam Bakar Madu", price: 55000 },
    { id: 3, name: "Mie Goreng Seafood", price: 50000 },
    { id: 4, name: "Sate Ayam (10 tusuk)", price: 48000 },
    { id: 5, name: "Gado-Gado", price: 35000 },
  ],

  Snack: [
    { id: 6, name: "Tahu Crispy", price: 22000 },
    { id: 7, name: "Pisang Goreng Keju", price: 28000 },
  ],

  Drink: [
    { id: 8, name: "Es Teh Manis", price: 12000 },
    { id: 9, name: "Es Jeruk", price: 15000 },
  ],
};

const formatPrice = (price: number) => {
  return `Rp ${price.toLocaleString("id-ID")}`;
};

export default function NewOrder() {
  const [tableNumber, setTableNumber] = useState("12");
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"Walk-in" | "Dine-in">("Walk-in");

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addItem = (menu: MenuItem) => {
    setOrderItems((current) => {
      const existing = current.find((item) => item.id === menu.id);

      if (existing) {
        return current.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { ...menu, quantity: 1 }];
    });
  };

  const removeItem = (menuId: number) => {
    setOrderItems((current) =>
      current
        .map((item) =>
          item.id === menuId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getQuantity = (menuId: number) => {
    return orderItems.find((item) => item.id === menuId)?.quantity ?? 0;
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [orderItems]);

  const serviceCharge = subtotal * 0.1;
  const total = subtotal + serviceCharge;

  return (
    <div className="min-h-screen bg-[#FCFAF7] p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-7">
        <div className="space-y-7">
          <section className="rounded-3xl border-2 border-[#EAE4DC] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-[#231812]">
              Detail pelanggan
            </h2>

            <div className="grid grid-cols-[1fr_1fr_auto] gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#231812]">
                  Nomor meja
                </label>

                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#EAE4DC] px-3 py-2 text-base text-[#231812] outline-none transition focus:border-[#F56600]"
                />
              </div>

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

              <div>
                <label className="mb-2 block text-sm font-medium text-[#231812]">
                  Tipe
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderType("Walk-in")}
                    className={`rounded-xl px-6 py-2 font-medium transition ${
                      orderType === "Walk-in"
                        ? "bg-[#F56600] text-white"
                        : "border-2 border-[#EAE4DC] bg-white text-[#231812]"
                    }`}
                  >
                    Walk-in
                  </button>

                  <button
                    onClick={() => setOrderType("Dine-in")}
                    className={`rounded-xl px-6 py-2 font-medium transition ${
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

          {Object.entries(menus).map(([category, items]) => (
            <section
              key={category}
              className="rounded-3xl border-2 border-[#EAE4DC] bg-white p-6 shadow-sm"
            >
              <h2 className="mb-5 text-lg font-semibold text-[#231812]">
                {category}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {items.map((menu) => {
                  const quantity = getQuantity(menu.id);

                  return (
                    <div
                      key={menu.id}
                      className="flex items-center justify-between rounded-2xl border-2 border-[#EAE4DC] px-5 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[#231812] text-sm">
                          {menu.name}
                        </p>

                        <p className="text-sm text-[#806E60]">
                          {formatPrice(menu.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(menu.id)}
                          disabled={quantity === 0}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#EAE4DC] text-xl text-[#806E60] transition hover:bg-[#FAF7F3] disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="w-4 text-center text-base text-[#231812]">
                          {quantity}
                        </span>

                        <button
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

        <aside className="h-fit rounded-3xl border-2 border-[#EAE4DC] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#231812]">
            Ringkasan pesanan
          </h2>

          {orderItems.length === 0 ? (
            <p className="mt-6 text-[#806E60]">Belum ada item dipilih.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-[#231812]">
                    {item.quantity}× {item.name}
                  </span>

                  <span className="shrink-0 text-[#806E60]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
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
            disabled={orderItems.length === 0}
            className="mt-7 w-full rounded-xl bg-[#F56600] px-5 py-3.5 font-semibold text-white transition hover:bg-[#DD5A00] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Simpan & kirim ke dapur
          </button>
        </aside>
      </div>
    </div>
  );
}
