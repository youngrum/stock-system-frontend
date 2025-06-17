"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { CreateInventoryRequest, InventoryItem } from "@/types/InventoryItem";
import { ApiSuccessResponse, ApiErrorResponse } from "@/types/ApiResponse";
import Loader from "@/components/ui/Loader";
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { CATEGORIES } from "@/data/categories";

export default function InventoryNewPage() {
  const router = useRouter();
  const isLoggedIn = useAuthGuard();

  // 認証ガードを使用して、ログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    modelNumber: "",
    manufacturer: "",
    currentStock: 0,
    location: "",
    remarks: "",
  });

  const [successResponse, setSuccessResponse] =
    useState<ApiSuccessResponse<InventoryItem> | null>(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "currentStock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    const confirmed = window.confirm(`本当にこの内容で入庫しますか？\n品名：${form.itemName}\nカテゴリー：${form?.category}\n仕入先: ${
        form.modelNumber || "未入力"
      }\n↓\n数量: ${form.currentStock}\n備考: ${form.location || "なし"}\n備考: ${form.remarks || "なし"}`)

    if (!confirmed) {
      window.confirm("処理を取り消しました");
      return;
    }
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateInventoryRequest = {
        itemName: form.itemName,
        category: form.category,
        modelNumber: form.modelNumber || "-",
        manufacturer: form.manufacturer || "-",
        currentStock: form.currentStock || 0,
        location: form.location || "-",
        remarks: form.remarks || "-",
      };
      const res = await api.post("/inventory/new", payload);
      console.log(res.data);
      setSuccessResponse(res.data);
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } }
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(`エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`); // エラーメッセージを利用
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setSuccessResponse(null);
    setForm({
      itemName: "",
      category: "",
      modelNumber: "",
      manufacturer: "",
      currentStock: 0,
      location: "",
      remarks: "",
    });
  };

  return (
    <>
      {loading && <Loader />}
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
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            ></input>
          </div>
          <div>
            <label htmlFor="category" className="block mb-1 font-medium">
              カテゴリ *
            </label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            >
              <option value="">-- カテゴリを選択してください --</option> {/* デフォルトの選択肢 */}
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="modelNumber" className="block mb-1 font-medium">
              型番・規格
            </label>
            <input
              type="text"
              name="modelNumber"
              value={form.modelNumber}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label htmlFor="manufacturer" className="block mb-1 font-medium">
              メーカー
            </label>
            <input
              type="text"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label htmlFor="currentStock" className="block mb-1 font-medium">
              在庫数 * <span className="text-sm">(ID発行のみなら、0でOK)</span>
            </label>
            <input
              type="number"
              name="currentStock"
              value={form.currentStock}
              min={0}
              onChange={handleChange}
              placeholder="例: 10"
              required
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              保管先
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              placeholder="例: 棚 上から3段目の左側の箱"
              style={{ border: "1px solid #9F9F9F" }}
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
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push("/inventory")}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded text-white hover:opacity-80 disabled:opacity-50"
              style={{
                background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
              }}
            >
              {loading ? "登録中..." : "在庫を登録する"}
            </button>
          </div>
        </form>
      </div>
      {successResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <p className="bg-white shadoow p-5 rounded">
            <p>登録に成功しました。</p>
            <p className="mb-5">在庫ID: {successResponse.data.itemCode}</p>
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white mr-2"
              onClick={handleContinue}
            >
              続けて登録
            </button>
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white"
              onClick={() => router.push("/inventory")}
            >
              在庫検索に戻る
            </button>
          </p>
        </div>
      )}
    </>
  );
}
