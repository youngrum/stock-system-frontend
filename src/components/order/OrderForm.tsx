"use client";

import { useState, useEffect, useRef } from "react";
import { PurchaseOrderRequest,OrderItem } from "@/types/PurchaseOrder";
import { InventoryItem } from "@/types/InventoryItem";
import { X } from "lucide-react";
import api from "@/services/api";

type Props = {
  onSubmit: (formData: PurchaseOrderRequest) => void;
};

export default function OrderForm({ onSubmit }: Props) {
const [items, setItems] = useState<OrderItem[]>([
    {
        itemCode: "",
        itemName: "",
        category: "",
        modelNumber: "",
        price: 0,
        quantity: 1,
        remarks: "-",
        autoFetchRequired: false,
        autoSuggestRequired: false,
        readOnlyFields: {
        itemName: false,
        category: false,
        modelNumber: false,
        },
    },
]);
      
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [remarks, setRemarks] = useState("-");
  const [suggestionsMap, setSuggestionsMap] = useState<Record<number, InventoryItem[]>>({});
  const [focusedField, setFocusedField] = useState<null | { index: number; field: string }>(null);
  const skipBlurRef = useRef(false); // フォームのフォーカス外しのフラグ

  const addItem = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        itemName: "",
        category: "",
        modelNumber: "",
        price: 0,
        quantity: 1,
        remarks: "-",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const prevItem = prevItems[index];
      const newItem = {
        ...prevItem,
        [field]: field === "quantity" || field === "price" || field === "shippingFee"
          ? Number(value)
          : value,
      };

      // itemCode が変わったかを検知
      if (field === "itemCode") {
        if ( prevItem.itemCode !== value) {
            newItem.autoFetchRequired = true; // フラグを立てる（useEffect検知用）
        }

        // itemCodeが空に戻ったら readOnly を解除
        if (value.trim() === "") {
            // 空欄なら候補クリア
            setSuggestionsMap((prev) => ({ ...prev, [index]: [] }));
            // 他入力欄もクリア
            newItem.itemName = "";
            newItem.category = "";
            newItem.modelNumber = "";
            newItem.readOnlyFields = {
            itemName: false,
            category: false,
            modelNumber: false,
            };
        }
      }

      // 品名と型番の変更検知
      if (field === "itemName" || field === "modelNumber") {
        if (prevItem[field] !== value && !prevItem.itemCode) {
          newItem.autoSuggestRequired = true;
        }
      }  
      newItems[index] = newItem;
      return newItems;
    });
  };

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const promises = items.map(async (item, index) => {
        if (item.autoFetchRequired && item.itemCode) {
          try {
            const res = await api.get("/inventory/search", {
              params: {
                itemCode: item.itemCode,
              },
            });
  
            const content = res.data?.data?.content;
            console.log(content);
            const suggestions = content || [];
            setSuggestionsMap((prev) => ({ ...prev, [index]: suggestions }));

            setTimeout(() => {
                if (focusedField?.index === index) {
                  setFocusedField({ index, field: focusedField.field }); // 再トリガー
                }
              }, 0);
  
            if (content && content.length > 0) {
              const found = content[0];
              const updated = [...items];
              updated[index] = {
                ...updated[index],
                itemName: found.itemName,
                category: found.category,
                modelNumber: found.modelNumber,
                autoFetchRequired: false,
                readOnlyFields: {
                    itemName: true,
                    category: true,
                    modelNumber: true,
                  },
              };
              setItems(updated);
            } else {
              console.warn("在庫IDに一致するデータが見つかりません:", item.itemCode);
            }
          } catch (err: unknown) {
              console.log(err);
        }

        // 品名と型番のサジェスト取得
        if (
            item.autoSuggestRequired &&
            !item.itemCode &&
            (item.itemName?.trim() || item.modelNumber?.trim() || item.category?.trim())
          ) {
            try {
              const res = await api.get("/inventory/search", {
                params: {
                  itemName: item.itemName || "",
                  modelNumber: item.modelNumber || "",
                  category: item.category || "",
                },
              });
          
              const content = res.data?.data?.content || [];
              console.log(content);
              setSuggestionsMap((prev) => ({ ...prev, [index]: content }));

              setTimeout(() => {
                if (focusedField?.index === index) {
                  setFocusedField({ index, field: focusedField.field }); // 再トリガー
                }
              }, 0);

              // ※候補が1件だけなら自動補完
              if (content.length === 1) {
                const found = content[0];
                const updated = [...items];
                updated[index] = {
                  ...updated[index],
                  itemCode: found.itemCode,
                  itemName: found.itemName,
                  category: found.category,
                  modelNumber: found.modelNumber,
                  autoSuggestRequired: false,
                  autoFetchRequired: false,
                  readOnlyFields: {
                    itemName: true,
                    category: true,
                    modelNumber: true,
                  },
                };
              } else {
                // 候補が複数あればサジェスト表示はUI側で処理
                const updated = [...items];
                updated[index].autoSuggestRequired = false;
              }
            } catch (error) {
              console.error("補完候補の取得に失敗:", error);
            }
          }
        }
      });
  
      await Promise.all(promises);
    };
  
    fetchAndUpdate();
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: PurchaseOrderRequest = {
      supplier,
      shippingFee,
      orderDate,
      remarks,
      details: items.map((item) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        modelNumber: item.modelNumber,
        price: item.price,
        quantity: item.quantity,
        remarks: item.remarks,
      })),
    };
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6"
      style={{ color: "#101540" }}
    >
      <h2 className="text-2xl font-bold">発注登録</h2>
      <h3 className="text-lg font-semibold mb-3">共通情報</h3>
      <div className="grid md:grid-cols-3 gap-x-4 gap-y-2 border-b pb-3 text-sm">
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">仕入先</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">発注日</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block mb-1 pb-2 pt-1 font-semibold">送料</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
            required
          />
        </div>
        <div className="col-span-3">
          <label className="block mb-1 pb-2 pt-1 font-semibold">備考</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="使用案件・購入目的など"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">商品明細</h3>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-20 gap-x-4 gap-y-1 pt-4 rounded-md bg-white mb-4"
          >
            {/* 上段 */}
            <div className="col-span-4 rerative">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>在庫ID</label>
              <input
                type="text"
                value={item.itemCode}
                onChange={(e) => updateItem(index, "itemCode", e.target.value)}
                onFocus={() => setFocusedField({ index, field: "itemCode" })}
                onBlur={() => {
                    setTimeout(() => {
                      const currentItem = items[index];
                      // itemCode が空欄 or readOnlyなら候補を強制反映しない
                      if (
                        !skipBlurRef.current && // ← フラグがfalseのときだけ補完
                        currentItem.itemCode.trim() !== "" && // 空欄ではない
                        suggestionsMap[index]?.length > 0
                      ) {
                        const found = suggestionsMap[index][0];
                        // フォーカス外したとき、候補があるなら補完
                        updateItem(index, "itemCode", found.itemCode);
                      }
                      skipBlurRef.current = false;
                      setFocusedField(null);
                    }, 150);
                  }}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {focusedField?.index === index && focusedField.field === "itemCode" && suggestionsMap[index]?.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-w-[500px] border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                    {suggestionsMap[index].map((sug) => (
                    <li
                        key={sug.itemCode}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                            skipBlurRef.current = true;
                            // onBlurより前に発火させるため onMouseDown を使用
                            updateItem(index, "itemCode", sug.itemCode);
                          }}
                        onClick={() => {
                        updateItem(index, "itemCode", sug.itemCode);
                        }}
                    >
                        {sug.itemCode} : {sug.itemName} / {sug.modelNumber}
                    </li>
                    ))}
                </ul>
                )}
            </div>
            <div className="col-span-9">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>品名</label>
              <input
                type="text"
                value={item.itemName}
                readOnly={item.readOnlyFields?.itemName}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition 
                    ${item.readOnlyFields?.itemName ? "text-gray-400" : "text-gray-900"}`
                }
                onChange={(e) => updateItem(index, "itemName", e.target.value)}
                onFocus={() => setFocusedField({ index, field: "itemName" })}
                onBlur={() => setTimeout(() => setFocusedField(null), 100)}
                required
              />
                {focusedField?.index === index && focusedField.field === "itemName" && suggestionsMap[index]?.length > 0  && suggestionsMap[index] && (
                <ul className="absolute z-10 mt-1 w-full max-w-[500px] border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                    {suggestionsMap[index].map((sug) => (
                    <li
                        key={sug.itemCode}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                            // onBlurより前に発火させるため onMouseDown を使用
                            updateItem(index, "itemCode", sug.itemCode);
                          }}
                        onClick={() => {
                        updateItem(index, "itemCode", sug.itemCode);
                        }}
                    >
                        {sug.itemCode} : {sug.itemName} / {sug.modelNumber}
                    </li>
                    ))}
                </ul>
                )}
            </div>
            <div className="col-span-6 row-span-2">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>備考</label>
              <textarea
                value={item.remarks}
                onChange={(e) => updateItem(index, "remarks", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition min-h-26"
              />
            </div>
            <div className="col-span-1 row-span-2 flex justify-center items-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                <X />
              </button>
            </div>

            {/* 下段 */}
            <div className="col-span-4">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>カテゴリー</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                readOnly={item.readOnlyFields?.category}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition
                    ${
                        item.readOnlyFields?.category ? "text-gray-400" : "text-gray-900"
                      }
                    `}
                required
              />
            </div>
            <div className="col-span-4">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>型番</label>
              <input
                type="text"
                value={item.modelNumber}
                readOnly={item.readOnlyFields?.modelNumber}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition
                    ${
                        item.readOnlyFields?.modelNumber ? "text-gray-400" : "text-gray-900"
                    }
                    `}
                onChange={(e) => updateItem(index, "modelNumber", e.target.value)}                
                onFocus={() => setFocusedField({ index, field: "modelNumber" })}
                onBlur={() => setTimeout(() => setFocusedField(null), 100)}
                required
              />
                {focusedField?.index === index && focusedField.field === "modelNumber" && suggestionsMap[index] && suggestionsMap[index].length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-w-[500px] border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                    {suggestionsMap[index].map((sug) => (
                    <li
                        key={sug.itemCode}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                            // onBlurより前に発火させるため onMouseDown を使用
                            updateItem(index, "itemCode", sug.itemCode);
                          }}
                        onClick={() => {
                        updateItem(index, "itemCode", sug.itemCode);
                        }}
                    >
                        {sug.itemCode} : {sug.itemName} / {sug.modelNumber}
                    </li>
                    ))}
                </ul>
                )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>数量</label>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>単価</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-blue-600 hover:underline"
        >
          ＋ 商品を追加
        </button>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:opacity-80"
          style={{
            background: "linear-gradient(to bottom, #3D00B8, #3070C3)",
          }}
        >
          登録する
        </button>
      </div>
    </form>
  );
}
