'use client';

import { InventorySearchParams } from '@/types/InventoryItem';
import { useState } from 'react';
import Image from "next/image";

export default function InventorySearchForm({
  onSearch,
}: {
  onSearch: (params: InventorySearchParams) => void;
}) {
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [modelNumber, setModelNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ itemCode, itemName, category, modelNumber });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d113d] text-white p-6 rounded shadow-md mb-6 transition-all duration-300 ease-in-out animate-fade-in"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID */}
        <div>
          <input
            type="text"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            placeholder="IDを入力"
            className="w-full px-3 py-2 rounded bg-white text-black focus:outline-none"
          />
        </div>

        {/* 品名 */}
        <div>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="品名を入力"
            className="w-full px-3 py-2 rounded bg-white text-black focus:outline-none"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="カテゴリーを入力"
            className="w-full px-3 py-2 rounded bg-white text-black focus:outline-none"
          />
        </div>

        {/* 型番 */}
        <div>
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="型番を入力"
            className="w-full px-3 py-2 rounded bg-white text-black focus:outline-none"
          />
        </div>
      </div>

      {/* 検索ボタン */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
        <Image
            src="/icon_search.svg" 
            alt="search icon"
            className=""
            width={20}
            height={20}
        /> 
        </button>
      </div>
    </form>
  );
}
