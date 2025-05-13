"use client";

import { useState } from "react";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="text-gray-800 bg-white shadow p-4 flex items-center justify-between relative">
      {/* ハンバーガー */}
      <button className="text-2xl" onClick={() => console.log("サイドバー開閉トグル予定")}>☰</button>
      <h2 className="text-lg font-bold mb-4">在庫検索画面</h2>

      {/* 検索ボタン */}
      <button
        className="text-xl"
        onClick={() => setShowSearch(!showSearch)}
      >
        🔍
      </button>

      {/* ログインユーザー表示（仮） */}
      <div className="px-3 py-1 rounded">ログインユーザー名</div>

      {/* 検索フォーム */}
      {showSearch && (
        <div className="absolute left-0 top-full w-full bg-gray-100 shadow-inner p-4 animate-fade-down">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="商品コード"
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="品名"
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="カテゴリ"
              className="p-2 border rounded"
            />
          </div>
        </div>
      )}
    </header>
  );
}
