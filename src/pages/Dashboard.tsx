import CardOrder from "../components/CardOrder";
import ProgresCard from "../components/ProgresCard";
import { ChefHat, CircleCheck, Wallet } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <div className="p-8 flex flex-col gap-5">
        <div className="flex flex-wrap gap-6">
          <ProgresCard
            title="In Progress"
            number={20}
            icon={<ChefHat size={22} />}
          />

          <ProgresCard
            title="Served"
            number={20}
            icon={<CircleCheck size={22} />}
          />

          <ProgresCard
            title="Total Pendapatan"
            number="Rp 396.000"
            icon={<Wallet size={22} />}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <CardOrder />
          <CardOrder />
          <CardOrder />
        </div>
      </div>
    </>
  );
}
