import { useEffect, useState } from "react";

import CardOrder from "../components/CardOrder";
import ProgresCard from "../components/ProgresCard";

import { ChefHat, CircleCheck, Wallet } from "lucide-react";

import { getAllOrder } from "../api/orderApi";

import type { Order, OrderStatus } from "../types/Order";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrder();

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Update status order tanpa mengganti
   * seluruh object order.
   */
  const handleStatusChanged = (orderId: number, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
  };

  const inProgressCount = orders.filter(
    (order) => order.status === "IN_PROGRESS",
  ).length;

  const servedCount = orders.filter(
    (order) => order.status === "SERVED",
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status === "PAID")
    .reduce((total, order) => total + Number(order.total), 0);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        <ProgresCard
          title="In Progress"
          number={inProgressCount}
          icon={<ChefHat size={22} />}
        />

        <ProgresCard
          title="Served"
          number={servedCount}
          icon={<CircleCheck size={22} />}
        />

        <ProgresCard
          title="Total Pendapatan"
          number={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
          icon={<Wallet size={22} />}
        />
      </div>

      {/* ORDERS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {loading ? (
          <p className="text-[#806E60]">Memuat pesanan...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#806E60]">Belum ada pesanan.</p>
        ) : (
          orders.map((order) => (
            <CardOrder
              key={order.id}
              order={order}
              onStatusChanged={handleStatusChanged}
            />
          ))
        )}
      </div>
    </div>
  );
}
