'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type InventoryItem = {
  itemCode: string
  itemName: string
  modelNumber: string
  category: string
  currentStock: number
  lastUpdated: string
}

export default function InventoryReceivePage() {
  const searchParams = useSearchParams()
  const itemCode = searchParams.get('itemCode')

  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!itemCode) return

    setLoading(true)
    fetch(`/api/inventory/${itemCode}`)
      .then((res) => {
        if (!res.ok) throw new Error('データ取得失敗')
        return res.json()
      })
      .then((json) => {
        setItem(json.data)
      })
      .catch((err) => {
        console.error('取得失敗:', err)
      })
      .finally(() => setLoading(false))
  }, [itemCode])

  if (loading) return <p>読み込み中...</p>
  if (!itemCode) return <p>商品コードが指定されていません</p>
  if (!item) return <p>商品情報が見つかりませんでした</p>

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">入庫登録</h1>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold">商品コード</label>
          <input type="text" value={item.itemCode} readOnly className="border p-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">品名</label>
          <input type="text" value={item.itemName} readOnly className="border p-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">型番</label>
          <input type="text" value={item.modelNumber} readOnly className="border p-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">カテゴリ</label>
          <input type="text" value={item.category} readOnly className="border p-1 w-full" />
        </div>

        {/* ↓ 入庫登録用の数量などを追加 */}
        <div>
          <label className="block font-semibold">入庫数</label>
          <input type="number" min={1} className="border p-1 w-full" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          入庫する
        </button>
      </form>
    </div>
  )
}
