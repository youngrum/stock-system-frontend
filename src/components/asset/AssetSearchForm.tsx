"use client";

import { AssetSearchParams } from "@/types/AssetItem";
import { useState } from "react";
import { Search } from 'lucide-react';

export default function AssetSearchForm({
  onSearch,
}: {
  onSearch: (params: AssetSearchParams) => void;
}) {
  const [assetCode, setAssetCode] = useState("");
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("");
  const [modelNumber, setModelNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔽 ここに追加
    console.log("🔍 フォーム送信時の検索条件", {
      assetCode,
      assetName,
      category,
      modelNumber,
    });

    onSearch({
      assetCode: assetCode || undefined,
      assetName: assetName || undefined,
      category: category || undefined,
      modelNumber: modelNumber || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border-b mb-6 transition-all duration-300 ease-in-out animate-fade-in"
      style={{ borderBottom: '1px solid #101540' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID */}
        <div>
          <input
            type="text"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            placeholder="管理番号を入力"
            className="w-full px-3 py-2 text-[#0d113d] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100" style={{ border: '1px solid #9F9F9F' }}
          />
        </div>

        {/* 品名 */}
        <div>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="設備品名を入力"
            className="w-full px-3 py-2 text-[#0d113d] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100" style={{ border: '1px solid #9F9F9F' }}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="カテゴリーを入力"
            className="w-full px-3 py-2 text-[#0d113d] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100" style={{ border: '1px solid #9F9F9F' }}
          />
        </div>

        {/* 型番 */}
        <div>
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="型番・規格を入力"
            className="w-full px-3 py-2 text-[#0d113d] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100" style={{ border: '1px solid #9F9F9F' }}
          />
        </div>
      </div>

      {/* 検索ボタン */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="text-black px-4 py-2 rounded shadow-md hover:opacity-90"
          style={{
              background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
            }}
        >
          <Search className="text-white" width={30} height={30}/>
        </button>
      </div>
    </form>
  );
}
