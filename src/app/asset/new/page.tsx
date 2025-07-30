"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { CreateAssetRequest, AssetIetmResponse } from "@/types/AssetItem"
import { ApiSuccessResponse, ApiErrorResponse } from "@/types/ApiResponse";
import Loader from "@/components/ui/Loader";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { ASSET_CATEGORIES } from "@/data/categories";

export default function AssetNewPage() {
  const router = useRouter();
  const isLoggedIn = useAuthGuard();
  
  // 認証ガードを使用して、ログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const [formData, setFormData] = useState<CreateAssetRequest | null>({
    assetCode: "",
    assetName: "",
    manufacturer: "",
    modelNumber: "",
    category: "",
    supplier: "",
    serialNumber: "",
    registDate: "",
    purchasePrice: 0,
    quantity: 0,
    location: "",
    status: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    fixedAssetManageNo: "",
    monitored: false,
    calibrationRequired: false,
    remarks: "",
  });

  const [successResponse, setSuccessResponse] =
    useState<ApiSuccessResponse<AssetIetmResponse> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      console.log(checked);
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `本当にこの内容で登録しますか？\n
        管理番号：${formData.assetCode}
        設備名：${formData.assetName}
        メーカー：${formData.manufacturer}
        型番・規格：${formData.modelNumber}
        カテゴリー：${formData?.category}
        仕入先: ${formData.modelNumber}
        製造番号: ${formData.manufacturer || "未入力"}
        固定資産管理番号: ${formData.fixedAssetManageNo || "未入力"}\n
        前回校正日: ${formData.lastCalibrationDate || "未入力"}
        次回校正日: ${formData.nextCalibrationDate || "未入力"}\n
        保管先: ${formData.location || "未入力"}
        監視: ${formData.monitored === true ? "対象" : "対象外"}
        校正: ${formData.monitored === true ? "必要" : "不要"}
        備考: ${formData.remarks || "未入力"}`
    );

    if (!confirmed) {
      window.alert("処理を取り消しました"); 
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/asset/new", formData);
      console.log(res.data);
      setSuccessResponse(res.data);
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(
          `エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`
        ); // エラーメッセージを利用
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setSuccessResponse(null);
    setFormData({
      assetCode: "",
      assetName: "",
      manufacturer: "",
      modelNumber: "",
      category: "",
      supplier: "",
      serialNumber: "",
      registDate: "",
      purchasePrice: 0,
      quantity: 0,
      location: "",
      status: "",
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      fixedAssetManageNo: "",
      monitored: false,
      calibrationRequired: false,
      remarks: "",
    });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="max-w-xl mx-auto bg-white border-gray-400 shadow p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">新規設備登録</h1>
          <div className="border rounded p-2 hover:bg-[#1d1f3c] hover:text-gray-200">
            <button className="text-xl" onClick={() => router.push("/csv")}>
              import with csv
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="assetName" className="block mb-1 font-medium">
              管理番号 *
            </label>
            <input
              type="text"
              name="assetCode"
              value={formData.assetCode}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="assetName" className="block mb-1 font-medium">
              設備名 *
            </label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="manufacturer" className="block mb-1 font-medium">
              メーカー *
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            />
          </div>
          <div>
            <label htmlFor="modelNumber" className="block mb-1 font-medium">
              型番・規格 *
            </label>
            <input
              type="text"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-1 font-medium">
              カテゴリー *
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            >
              <option value="">-- カテゴリを選択してください --</option>{" "}
              {/* デフォルトの選択肢 */}
              {ASSET_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="supplier" className="block mb-1 font-medium">
              仕入れ先 *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            />
          </div>
          <div>
            <label htmlFor="purchasePrice" className="block mb-1 font-medium">
              購入金額 * <span className="text-sm">(不明なら 0 と記載)</span>
            </label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice ?? 0}
              min={0}
              onChange={handleChange}
              placeholder="例: 15,000"
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required
            />
          </div>
          <div>
            <label htmlFor="serialNumber" className="block mb-1 font-medium">
              製造番号
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              placeholder=""
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label htmlFor="lastCalibrationDate" className="block mb-1 font-medium">
              前回校正日
            </label>
            <input
              type="date"
              name="lastCalibrationDate"
              value={formData.lastCalibrationDate}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required={formData.calibrationRequired}
            />
          </div>
          <div>
            <label htmlFor="nextCalibrationDate" className="block mb-1 font-medium">
              次回校正日
            </label>
            <input
              type="date"
              name="nextCalibrationDate"
              value={formData.nextCalibrationDate}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
              required={formData.calibrationRequired}
            />
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              保管先
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              placeholder="例: 棚 上から3段目の左側の箱"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div>
            <label htmlFor="fixedAssetManageNo" className="block mb-1 font-medium">
              固定資産管理番号
            </label>
            <input
              type="text"
              name="fixedAssetManageNo"
              value={formData.fixedAssetManageNo}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              placeholder=""
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="calibrationRequired" className="block mb-1 font-medium">
                校正要否
              </label>
              <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="calibrationRequired"
                checked={formData.calibrationRequired}
                onChange={handleChange}
                className="sr-only"
                disabled={loading}
              />
              <div className={`relative inline-block w-12 h-6 transition-colors duration-200 rounded-full ${
                  formData.calibrationRequired ? 'bg-blue-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    formData.calibrationRequired ? 'transform translate-x-6' : ''
                  }`} />
              </div>
              </label>
            </div>
            <div>
              <label htmlFor="monitored" className="block mb-1 font-medium">
                監視
              </label>
              <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="monitored"
                checked={formData.monitored}
                onChange={handleChange}
                className="sr-only"
                disabled={loading}
              />
              <div className={`relative inline-block w-12 h-6 transition-colors duration-200 rounded-full ${
                  formData.monitored ? 'bg-blue-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    formData.monitored ? 'transform translate-x-6' : ''
                  }`} />
              </div>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="remarks" className="block mb-1 font-medium">
              備考
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full bg-gray-50 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2"
              style={{ border: "1px solid #9F9F9F" }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push("/asset")}
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
            <p className="mb-5">設備コード: {successResponse.data.assetCode}</p>
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white mr-2"
              onClick={handleContinue}
            >
              続けて登録
            </button>
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white"
              onClick={() => router.push("/asset")}
            >
              設備一覧ページに戻る
            </button>
          </p>
        </div>
      )}
    </>
  );
}
