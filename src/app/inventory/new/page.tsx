"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { CreateInventoryRequest } from "@/types/InventoryItem";

export default function InventoryNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    itemName: "",
    category: "",
    modelNumber: "",
    currentStock: 0,
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "currentStock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: CreateInventoryRequest = {
        itemName: form.itemName,
        category: form.category,
        modelNumber: form.modelNumber || "-",
        currentStock: form.currentStock || 0,
        remarks: form.remarks || "",
      };
      await api.post("/inventory/new", payload);
      router.push("/inventory");
    } catch (err) {
      setError("登録に失敗しました。");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border-gray-400 shadow p-5">
      <h1 className="text-2xl font-bold mb-6">新規在庫登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block mb-1 font-medium">
            品名 *
          </label>

          <input
            type="text"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></input>
        </div>
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            カテゴリ *
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="modelNumber" className="block mb-1 font-medium">
            型番
          </label>
          <input
            type="text"
            name="modelNumber"
            value={form.modelNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="currentStock" className="block mb-1 font-medium">
            在庫数 *
          </label>
          <input
            type="number"
            name="currentStock"
            value={form.currentStock}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="remarks" className="block mb-1 font-medium">
            備考
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "登録中..." : "在庫を登録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
