"use client";

import { useState, useEffect, useRef } from "react";
import { PurchaseOrderRequest, PurchaseOrderDetailRequest } from "@/types/PurchaseOrder";
import { InventoryItem } from "@/types/InventoryItem";
import { OrderItemState } from "@/components/order/reducers/orderFormReducer";
import { X } from "lucide-react";
import api from "@/services/api";

type Props = {
  onSubmit: (formData: PurchaseOrderRequest) => void;
  onReset: () => void;
};

export default function OrderForm({ onSubmit, onReset }: Props) {
  // 初期状態の定義 リセットに使用
  const initialItemState: OrderItemState = {
    itemCode: "",
    itemName: "",
    category: "",
    modelNumber: "",
    manufacturer: "",
    price: "",
    quantity: "",
    remarks: "",
    location: "",
    autoFetchRequired: false,
    autoSuggestRequired: false,
    readOnlyFields: {
      itemName: false,
      category: false,
      modelNumber: false,
      location: false
    },
  };
  const [items, setItems] = useState<OrderItemState[]>([
    {
      itemCode: "",
      itemName: "",
      category: "",
      modelNumber: "",
      manufacturer: "",
      price: "",
      quantity: "",
      remarks: "",
      location: "",
      autoFetchRequired: false,
      autoSuggestRequired: false,
      readOnlyFields: {
        itemName: false,
        category: false,
        modelNumber: false,
        location: false
      },
    },
  ]);

  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>("");
  const [remarks, setRemarks] = useState("");
  const [suggestionsMap, setSuggestionsMap] = useState<Record<number, InventoryItem[]>>({});
  const [focusedField, setFocusedField] = useState<null | { index: number; field: string }>(null);
  const skipBlurRef = useRef(false);
  
  // 処理中のフラグを管理（重複実行防止）
  const processingRef = useRef<Set<string>>(new Set());
  // フォーカス状態を管理するためのリファレンス
  const addItem = () => {
    setItems([
      ...items,
      {
        itemCode: "",
        itemName: "",
        category: "",
        modelNumber: "",
        manufacturer: "",
        location: "",
        price: 0,
        quantity: 1,
        remarks: "-",
        autoFetchRequired: false,
        autoSuggestRequired: false,
        readOnlyFields: {
          itemName: false,
          category: false,
          modelNumber: false,
          location: false,
        },
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    // 削除時にサジェストもクリア
    setSuggestionsMap(prev => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });
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
        if (prevItem.itemCode !== value) {
          if (value.trim() !== "") {
            newItem.autoFetchRequired = true;
          }
        }

        // itemCodeが空に戻ったら状態をリセット
        if (value.trim() === "") {
          // フォーカス状態は即座にリセットしない
          setSuggestionsMap((prev) => ({ ...prev, [index]: [] }));
          
          newItem.itemName = "";
          newItem.category = "";
          newItem.modelNumber = "";
          newItem.location = "";
          newItem.autoFetchRequired = false;
          newItem.autoSuggestRequired = false;
          newItem.readOnlyFields = {
            itemName: false,
            category: false,
            modelNumber: false,
            location: false,
          };
        }
      }

      // 品名と型番の変更検知時に、itemCodeが空の場合のみサジェストを有効化
      if (field === "itemName" || field === "modelNumber") {
        if (prevItem[field] !== value && !newItem.itemCode && value.trim() !== "") {
          newItem.autoSuggestRequired = true;
        }
      }
      
      newItems[index] = newItem;
      return newItems;
    });
  };

  const resetForm = () => {
    setItems([initialItemState]);
    setSupplier("");
    setOrderDate("");
    setShippingFee("");
    setRemarks("-");
    setSuggestionsMap({});
    setFocusedField(null);
  };

  useEffect(() => {
    onReset(resetForm);
  }, [onReset]);

  // useEffectを分離して依存関係を明確化
  useEffect(() => {
    const fetchItemByCode = async (item: PurchaseOrderDetailRequest, index: number) => {
      const key = `fetch-${index}-${item.itemCode}`;
      
      // 重複処理防止
      if (processingRef.current.has(key)) {
        return;
      }
      processingRef.current.add(key);

      try {
        const res = await api.get("/inventory/search", {
          params: { itemCode: item.itemCode },
        });

        const content = res.data?.data?.content;
        console.log("自動取得結果:", content);
        const suggestions = content || [];
        
        setSuggestionsMap((prev) => ({ ...prev, [index]: suggestions }));

        if (content && content.length > 0) {
          const found = content[0];
          setItems(prevItems => {
            const updated = [...prevItems];
            // 現在の状態を確認してから更新
            if (updated[index] && updated[index].itemCode === item.itemCode) {
              updated[index] = {
                ...updated[index],
                itemName: found.itemName,
                category: found.category,
                modelNumber: found.modelNumber,
                location: found.location,
                autoFetchRequired: false,
                readOnlyFields: {
                  itemName: true,
                  category: true,
                  modelNumber: true,
                  location: true,
                },
              };
            }
            return updated;
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        // フラグをリセット（成功・失敗問わず）
        processingRef.current.delete(key);
        setItems(prevItems => {
          const updated = [...prevItems];
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              autoFetchRequired: false,
            };
          }
          return updated;
        });
      }
    };

    const suggestItems = async (item: PurchaseOrderDetailRequest, index: number) => {
      const key = `suggest-${index}-${item.itemName}-${item.modelNumber}-${item.category}`;
      
      // 重複処理防止
      if (processingRef.current.has(key)) {
        return;
      }
      processingRef.current.add(key);

      try {
        const res = await api.get("/inventory/search", {
          params: {
            itemName: item.itemName || "",
            modelNumber: item.modelNumber || "",
            category: item.category || "",
          },
        });

        const content = res.data?.data?.content || [];
        console.log("サジェスト取得結果:", content);
        setSuggestionsMap((prev) => ({ ...prev, [index]: content }));

        // 候補が1件だけなら自動補完
        if (content.length === 1) {
          const found = content[0];
          setItems(prevItems => {
            const updated = [...prevItems];
            // 現在の状態を確認してから更新
            if (updated[index] && !updated[index].itemCode) {
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
            }
            return updated;
          });
        }
      } catch (error) {
        console.error("補完候補の取得に失敗:", error);
      } finally {
        // フラグをリセット（成功・失敗問わず）
        processingRef.current.delete(key);
        setItems(prevItems => {
          const updated = [...prevItems];
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              autoSuggestRequired: false,
            };
          }
          return updated;
        });
      }
    };

    // 処理が必要なアイテムのみを対象に
    const fetchPromises: Promise<void>[] = [];
    
    items.forEach((item, index) => {
      if (item.autoFetchRequired && item.itemCode) {
        fetchPromises.push(fetchItemByCode(item, index));
      }
      
      if (
        item.autoSuggestRequired &&
        !item.itemCode &&
        (item.itemName?.trim() || item.modelNumber?.trim() || item.category?.trim() || item.location?.trim())
      ) {
        fetchPromises.push(suggestItems(item, index));
      }
    });

    if (fetchPromises.length > 0) {
      Promise.all(fetchPromises).catch(console.error);
    }
  }, [items]);

  const handleItemCodeBlur = (index: number) => {
    setTimeout(() => {
      const currentItem = items[index];
      if (
        !skipBlurRef.current &&
        currentItem?.itemCode.trim() !== "" &&
        suggestionsMap[index]?.length > 0
      ) {
        const found = suggestionsMap[index][0];
        updateItem(index, "itemCode", found.itemCode);
      }
      skipBlurRef.current = false;
      setFocusedField(null);
    }, 150);
  };

  // フォーカス処理を分離
  const handleFocus = (index: number, field: string) => {
    setFocusedField({ index, field });
  };

  const handleBlur = (index: number, field: string) => {
    setTimeout(() => {
      // 現在のフォーカス状態と一致する場合のみクリア
      setFocusedField(prev => {
        if (prev?.index === index && prev?.field === field) {
          return null;
        }
        return prev;
      });
    }, 100);
  };

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
        location: item.location,
      })),
    };
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
            min={0}
            placeholder="1000"
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
            <div className="col-span-4 relative">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>在庫ID</label>
              <input
                type="text"
                value={item.itemCode}
                onChange={(e) => updateItem(index, "itemCode", e.target.value)}
                onFocus={() => handleFocus(index, "itemCode")}
                onBlur={() => handleItemCodeBlur(index)} 
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {focusedField?.index === index && focusedField.field === "itemCode" && suggestionsMap[index]?.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                  {suggestionsMap[index].map((sug) => (
                    <li
                      key={sug.itemCode}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        skipBlurRef.current = true;
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
            <div className="col-span-9 relative">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>品名</label>
              <input
                type="text"
                value={item.itemName}
                readOnly={item.readOnlyFields?.itemName}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition 
                    ${item.readOnlyFields?.itemName ? "text-gray-400" : "text-gray-900"}`
                }
                onChange={(e) => updateItem(index, "itemName", e.target.value)}
                onFocus={() => handleFocus(index, "itemName")}
                onBlur={() => handleBlur(index, "itemName")}
                required
              />
              {focusedField?.index === index && focusedField.field === "itemName" && suggestionsMap[index]?.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-w-[500px] border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                  {suggestionsMap[index].map((sug) => (
                    <li
                      key={sug.itemCode}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
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
            <div className="col-span-6 row-span-1">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>備考</label>
              <textarea
                value={item.remarks}
                onChange={(e) => updateItem(index, "remarks", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
                    ${item.readOnlyFields?.category ? "text-gray-400" : "text-gray-900"}
                    `}
                required
              />
            </div>
            <div className="col-span-4 relative">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>型番</label>
              <input
                type="text"
                value={item.modelNumber}
                readOnly={item.readOnlyFields?.modelNumber}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition
                    ${item.readOnlyFields?.modelNumber ? "text-gray-400" : "text-gray-900"}
                    `}
                onChange={(e) => updateItem(index, "modelNumber", e.target.value)}                
                onFocus={() => handleFocus(index, "modelNumber")}
                onBlur={() => handleBlur(index, "modelNumber")}
                required
              />
              {focusedField?.index === index && focusedField.field === "modelNumber" && suggestionsMap[index]?.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-w-[500px] border border-gray-300 bg-white shadow-lg rounded text-sm text-gray-800 max-h-48 overflow-auto transition-all duration-200 opacity-100">
                  {suggestionsMap[index].map((sug) => (
                    <li
                      key={sug.itemCode}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
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
                placeholder="10"
                min={1}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>単価</label>
              <input
                type="number"
                value={item.price}
                placeholder="300"
                min={1}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-right"
                required
              />
            </div>
            <div className="col-span-6">
              <label className="block text-sm text-gray-600 mb-1 font-semibold" style={{ color: "#101540" }}>保管先</label>
              <input
                type="text"
                value={item.location}
                placeholder="足立倉庫など"
                onChange={(e) => updateItem(index, "location", e.target.value)}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition
                  ${item.readOnlyFields?.location ? "text-gray-400" : "text-gray-900"}
                  `}
                  readOnly={item.readOnlyFields?.location}
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