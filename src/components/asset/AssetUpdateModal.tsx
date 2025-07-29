// components/asset/AssetUpdateModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/services/api";
import { AssetItem } from "@/types/AssetItem";
import { ApiErrorResponse } from "@/types/ApiResponse";
import { UpdateAssetRequest } from "@/types/AssetItem";

interface AssetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetItem;
  onSuccess: () => void;
}

export default function AssetUpdateModal({
  isOpen,
  onClose,
  asset,
  onSuccess,
}: AssetUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateAssetRequest>({
    id: null,
    assetCode: "",
    serialNumber: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    fixedAssetManageNo: "",
    location: "",
    registDate: "",
    monitored: false,
    calibrationRequired: false,
    remarks: "",
    status: "",
  });

// assetの値でformDataを初期化
  useEffect(() => {
    if (isOpen && asset && asset.id != null) {
      setFormData({
        id: asset.id,
        assetCode: asset.assetCode || "",
        serialNumber: asset.serialNumber || "",
        lastCalibrationDate: asset.lastCalibrationDate || "",
        nextCalibrationDate: asset.nextCalibrationDate || "",
        fixedAssetManageNo: asset.fixedAssetManageNo || "",
        location: asset.location || "",
        registDate: asset.registDate || "",
        monitored: asset.monitored || false,
        calibrationRequired: asset.calibrationRequired || false,
        remarks: asset.remarks || "",
        status: asset.status || "",
      });
    }
  }, [isOpen, asset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
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
    
    try {
      console.log("%o", formData);
      setLoading(true);
      await api.post(`/asset/update/${formData.id}`, formData);
      
      alert("更新が完了しました。");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("更新に失敗:", error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const apiError: ApiErrorResponse = err.response.data;
        alert(
          `エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${apiError.error}\n・message: ${apiError.message}\n・status: ${apiError.status}`
        );
      } else {
        alert("更新に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0d113d] opacity-40"
        onClick={onClose}
      />
      <div className="mt-20 relattive z-10 bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-2">
          <h2 className="text-xl font-semibold text-gray-800">{asset.assetName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <p className="text-sm text-[#0d113d] pb-2">型番：{asset.modelNumber ?? "-"}</p>
              <p className="text-sm text-[#0d113d] pb-2">カテゴリー: {asset.category ?? "-"}</p>
              <p className="text-sm text-[#0d113d] pb-2">メーカー: {asset.manufacturer ?? "-"}</p>
            </div>
            <div className="md:col-span-2">
              {/* 管理番号と製造番号 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    管理番号
                  </label>
                  <input
                    type="text"
                    name="assetCode"
                    value={formData.assetCode}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    placeholder={asset.assetCode ?? "-"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    製造番号
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    placeholder={asset.serialNumber ?? "-"}
                  />
                </div>
              </div>

              {/* 前回校正日と次回校正日 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    前回校正日
                  </label>
                  <input
                    type="date"
                    name="lastCalibrationDate"
                    value={formData.lastCalibrationDate}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    required={formData.calibrationRequired}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    次回校正日
                  </label>
                  <input
                    type="date"
                    name="nextCalibrationDate"
                    value={formData.nextCalibrationDate}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    required={formData.calibrationRequired}
                  />
                </div>
              </div>

              {/* 保管/設置場所と登録日 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  固定資産管理番号
                  </label>
                  <input
                    type="text"
                    name="fixedAssetManageNo"
                    value={formData.fixedAssetManageNo}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    placeholder={asset.fixedAssetManageNo}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    保管/設置場所
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    placeholder={asset.location}
                  />
                </div>

              </div>

              {/* 監視/認証フラグ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    登録日
                  </label>
                  <input
                    type="date"
                    name="registDate"
                    value={formData.registDate}
                    onChange={handleInputChange}
                    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      監視
                    </label>
                    <div className="flex items-center h-5">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="monitored"
                          checked={formData.monitored}
                          onChange={handleInputChange}
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      校正
                    </label>
                    <div className="flex items-center h-5">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="calibrationRequired"
                          checked={formData.calibrationRequired}
                          onChange={handleInputChange}
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
                  </div>
                </div>
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={1}
                  className="w-full  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={loading}
                  placeholder={asset.remarks ?? "-"}
                />
              </div>
              {/* ボタン */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2 text-white rounded-md transition-colors disabled:opacity-50"
                  style={{
                    background: loading 
                      ? "#9CA3AF" 
                      : "linear-gradient(to bottom, #3D00B8, #3070C3)",
                  }}
                >
                  {loading ? "更新中..." : "更新する"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}