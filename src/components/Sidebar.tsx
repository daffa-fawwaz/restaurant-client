import {
  ClipboardList,
  PlusCircle,
  LayoutGrid,
  Utensils,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <section className="fixed w-[300px] h-screen bg-[#FFFFFF] border-r-2 border-r-[#EAE4DC]">
      <div className="px-6 py-4 flex items-center gap-2">
        <img className="w-14 h-14" src="/logo.png" alt="Warung Ku" />

        <div>
          <h1 className="text-2xl font-semibold text-[#913300]">WarungKu</h1>

          <p className="text-sm font-medium text-[#806E60] ml-1">
            moto milik toko
          </p>
        </div>
      </div>

      <ul className="px-4 mt-4 text-[16px]  flex flex-col gap-3 text-[#806E60]">
        <NavLink
          to="/"
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FFEDD8] hover:text-[#913300] cursor-pointer transition"
        >
          <ClipboardList size={20} />
          <span>Active Orders</span>
        </NavLink>

        <NavLink
          to="/new-order"
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FFEDD8] hover:text-[#913300] cursor-pointer transition"
        >
          <PlusCircle size={20} />
          <span>New Orders</span>
        </NavLink>

        <NavLink
          to="/table"
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FFEDD8] hover:text-[#913300] cursor-pointer transition"
        >
          <LayoutGrid size={20} />
          <span>Tables</span>
        </NavLink>

        <NavLink
          to="/menu"
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FFEDD8] hover:text-[#913300] cursor-pointer transition"
        >
          <Utensils size={20} />
          <span>Menu</span>
        </NavLink>

        <li className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FFEDD8] hover:text-[#913300] cursor-pointer transition">
          <History size={20} />
          <span>Order History</span>
        </li>
      </ul>
    </section>
  );
}
