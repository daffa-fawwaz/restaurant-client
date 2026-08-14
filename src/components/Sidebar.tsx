import {
  ClipboardList,
  PlusCircle,
  LayoutGrid,
  Utensils,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navClass =
    "flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-[#FFEDD8] hover:text-[#913300]";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka navigasi"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-[#EAE4DC] bg-white text-[#913300] shadow-sm lg:hidden"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
        />
      )}

      <section className={`fixed z-50 h-dvh w-[280px] border-r-2 border-r-[#EAE4DC] bg-white transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Tutup navigasi" className="absolute right-4 top-5 rounded-lg p-2 text-[#806E60] lg:hidden">
          <X size={20} />
        </button>
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
          onClick={() => setIsOpen(false)} className={navClass}
        >
          <ClipboardList size={20} />
          <span>Active Orders</span>
        </NavLink>

        <NavLink
          to="/new-order"
          onClick={() => setIsOpen(false)} className={navClass}
        >
          <PlusCircle size={20} />
          <span>New Orders</span>
        </NavLink>

        <NavLink
          to="/table"
          onClick={() => setIsOpen(false)} className={navClass}
        >
          <LayoutGrid size={20} />
          <span>Tables</span>
        </NavLink>

        <NavLink
          to="/menu"
          onClick={() => setIsOpen(false)} className={navClass}
        >
          <Utensils size={20} />
          <span>Menu</span>
        </NavLink>

        <NavLink to="/history" onClick={() => setIsOpen(false)} className={navClass}>
          <History size={20} />
          <span>Order History</span>
        </NavLink>
      </ul>
      </section>
    </>
  );
}
