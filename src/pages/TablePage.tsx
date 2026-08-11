import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, CheckCircle, Armchair } from "lucide-react";
import TableModal from "../components/table/TableModal";
import SummaryCard from "../components/table/SummaryCard";

interface Table {
  id: number;
  number: number;
  capacity: number;
  isAvailable: boolean;
  createdAt: string;
}

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

const dummyTables: Table[] = [
  {
    id: 1,
    number: 1,
    capacity: 2,
    isAvailable: true,
    createdAt: "2026-07-01T09:00:00",
  },
  {
    id: 2,
    number: 3,
    capacity: 4,
    isAvailable: false,
    createdAt: "2026-07-01T09:05:00",
  },
  {
    id: 3,
    number: 5,
    capacity: 4,
    isAvailable: true,
    createdAt: "2026-07-02T10:12:00",
  },
  {
    id: 4,
    number: 8,
    capacity: 6,
    isAvailable: false,
    createdAt: "2026-07-04T18:40:00",
  },
  {
    id: 5,
    number: 12,
    capacity: 8,
    isAvailable: true,
    createdAt: "2026-07-08T11:20:00",
  },
];

export default function TablePage() {
  const [tables, setTables] = useState<Table[]>(dummyTables);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [form, setForm] = useState<TableForm>(initialForm);

  const totalTables = tables.length;

  const availableTables = tables.filter((table) => table.isAvailable).length;

  const totalSeats = tables.reduce((total, table) => total + table.capacity, 0);

  // =========================
  // OPEN CREATE
  // =========================

  const handleAddTable = () => {
    setEditingTable(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);

    setForm({
      number: String(table.number),
      capacity: String(table.capacity),
      isAvailable: table.isAvailable,
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
    setForm(initialForm);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const number = Number(form.number);
    const capacity = Number(form.capacity);

    if (!number || !capacity) {
      alert("Nomor meja dan kapasitas wajib diisi");
      return;
    }

    // Check duplicate table number
    const duplicate = tables.some(
      (table) => table.number === number && table.id !== editingTable?.id,
    );

    if (duplicate) {
      alert("Nomor meja sudah digunakan");
      return;
    }

    if (editingTable) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === editingTable.id
            ? {
                ...table,
                number,
                capacity,
                isAvailable: form.isAvailable,
              }
            : table,
        ),
      );
    } else {
      const newTable: Table = {
        id:
          tables.length > 0
            ? Math.max(...tables.map((table) => table.id)) + 1
            : 1,

        number,
        capacity,
        isAvailable: form.isAvailable,

        createdAt: new Date().toISOString(),
      };

      setTables((prev) => [...prev, newTable]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus meja ini?",
    );

    if (!confirmed) return;

    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const handleToggleAvailability = (id: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id
          ? {
              ...table,
              isAvailable: !table.isAvailable,
            }
          : table,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] p-8">
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

      <div className="overflow-hidden rounded-2xl border border-[#eadfd6] bg-white shadow-sm">
        <table className="w-full">
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

      {isModalOpen && (
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
