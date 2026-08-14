import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, Armchair } from "lucide-react";
import TableModal from "../components/table/TableModal";
import SummaryCard from "../components/table/SummaryCard";
import { toast } from "sonner";
import type { Table } from "../types/Table";
import axios from "axios";
import {
  getAllTable,
  updateIsAvailable,
  createTable,
  updateTable,
  deleteTable,
} from "../api/tableApi";
import { useHeaderAction } from "../contexts/HeaderActionContext";

interface TableForm {
  number: string;
  capacity: string;
  isAvailable: boolean;
}

const initialForm: TableForm = {
  number: "",
  capacity: "",
  isAvailable: true,
};

export default function TablePage() {
  const [tables, setTables] = useState<Table[]>([]);

  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const { tableModalOpen, openTableModal, closeTableModal } = useHeaderAction();

  const [form, setForm] = useState<TableForm>(initialForm);

  const totalTables = tables.length;

  const availableTables = tables.filter((table) => table.isAvailable).length;

  const totalSeats = tables.reduce((total, table) => total + table.capacity, 0);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getAllTable();
        console.log(data);
        setTables(data);
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      }
    };

    fetchTables();
  }, []);

  const handleAddTable = async () => {
    const number = Number(form.number);
    const capacity = Number(form.capacity);
    const isAvailable = form.isAvailable;

    if (!number) {
      alert("Nomor meja menu wajib diisi");
      return;
    }

    if (!capacity) {
      alert("kapasitas wajib di isi");
      return;
    }

    try {
      const newTable = await createTable({
        number,
        capacity,
        isAvailable,
      });

      setTables((prev) => [...prev, newTable]);
      closeTableModal();
      setForm(initialForm);
      toast.success("Meja berhasil ditambahkan");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal menambahkan meja");
      } else {
        toast.error("Terjadi kesalahan");
      }
    }
  };

  const handleEditTable = async (table: Table) => {
    setEditingTable(table);

    setForm({
      number: String(table.number),
      capacity: String(table.capacity),
      isAvailable: table.isAvailable,
    });

    openTableModal();
  };

  const handleCloseModal = () => {
    closeTableModal();
    setEditingTable(null);
    setForm(initialForm);
  };

  const handleUpdateTable = async () => {
    if (!editingTable) return;

    const number = Number(form.number);
    const capacity = Number(form.capacity);

    if (!number) {
      alert("Nomor meja wajib diisi");
      return;
    }

    if (!capacity) {
      alert("Kapasitas wajib diisi");
      return;
    }

    try {
      const updatedTable = await updateTable(editingTable.id, {
        number,
        capacity,
        isAvailable: form.isAvailable,
      });

      setTables((prev) =>
        prev.map((table) =>
          table.id === editingTable.id ? updatedTable : table,
        ),
      );

      closeTableModal();
      setEditingTable(null);
      setForm(initialForm);
      toast.success("Meja berhasil diupdate");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal menambahkan meja");
      } else {
        toast.error("Terjadi kesalahan");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTable) {
      handleUpdateTable();
      return;
    }
    handleAddTable();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus meja ini?",
    );

    if (!confirmed) return;

    deleteTable(id);

    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      const updatedTable = await updateIsAvailable(id);

      setTables((prev) =>
        prev.map((table) => (table.id === id ? updatedTable : table)),
      );
    } catch (error) {
      console.error("Failed to update table availability:", error);

      alert("Gagal mengubah ketersediaan meja");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] p-4 sm:p-6 lg:p-8">
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <SummaryCard
          icon={<Armchair size={20} />}
          label="Total meja"
          value={totalTables}
        />

        <SummaryCard
          icon={<CheckCircle size={20} />}
          label="Tersedia"
          value={availableTables}
        />

        <SummaryCard
          icon={<Armchair size={20} />}
          label="Total kursi"
          value={totalSeats}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#eadfd6] bg-white shadow-sm">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="border-b border-[#eadfd6] text-left text-[#8b7768]">
              <th className="px-3 py-2">ID</th>

              <th className="px-3 py-2">Nomor Meja</th>

              <th className="px-3 py-2">Kapasitas</th>

              <th className="px-3 py-2">Ketersediaan</th>

              <th className="px-3 py-2">Dibuat</th>

              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {tables.map((table) => (
              <tr
                key={table.id}
                className="border-b border-[#eadfd6] last:border-none"
              >
                <td className="px-3 py-2 text-[#8b7768]">{table.id}</td>

                <td className="px-3 py-2 font-semibold text-[#2d211b]">
                  Meja {table.number}
                </td>

                <td className="px-3 py-2 text-[#2d211b]">
                  {table.capacity} orang
                </td>

                <td className="px-3 py-2">
                  <button
                    onClick={() => handleToggleAvailability(table.id)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative h-5 w-10 rounded-full transition ${
                        table.isAvailable ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow transition ${
                          table.isAvailable ? "left-6" : "left-1"
                        }`}
                      />
                    </div>

                    <span
                      className={
                        table.isAvailable ? "text-orange-500" : "text-[#8b7768]"
                      }
                    >
                      {table.isAvailable ? "Tersedia" : "Terisi"}
                    </span>
                  </button>
                </td>

                {/* Created */}

                <td className="px-3 py-2 text-[#8b7768]">
                  {new Date(table.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditTable(table)}
                      className="rounded-xl border border-[#eadfd6] p-2.5 transition hover:bg-[#fff5ed]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(table.id)}
                      className="rounded-xl border border-[#eadfd6] p-2.5 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}

      {tableModalOpen && (
        <TableModal
          form={form}
          setForm={setForm}
          editingTable={editingTable}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
