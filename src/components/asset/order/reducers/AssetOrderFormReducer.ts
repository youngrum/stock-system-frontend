// import { AssetItem } from "@/types/AssetItem";

// // OrderItem の型定義を更新 (autoFetchRequiredなどを削除し、readOnlyFieldsは残す)
// export type OrderItemState = {
//   itemName: string;
//   category: string;
//   modelNumber: string;
//   manufacturer: string;
//   price: number;
//   quantity: number;
//   remarks: string;
//   autoFetchRequired?: boolean;
//   autoSuggestRequired: boolean;
//   readOnlyFields: {
//     itemCode?: boolean; // itemCodeは常に編集可能
//     itemName: boolean;
//     category: boolean;
//     modelNumber: boolean;
//     manufacturer: boolean;
//     location: boolean;
//   };
// };

// export type OrderFormState = {
//   items: OrderItemState[];
//   supplier: string;
//   orderDate: string;
//   shippingFee: number;
//   remarks: string;
//   suggestionsMap: Record<number, InventoryItem[]>;
//   focusedField: { index: number; field: string } | null;
//   highlightedSuggestionIndex: number;
// };

// export type OrderFormAction =
//   | { type: "UPDATE_ITEM_FIELD"; index: number; field: keyof OrderItemState; value: OrderItemState[keyof OrderItemState]}
//   | { type: "ADD_ITEM" }
//   | { type: "REMOVE_ITEM"; index: number }
//   | { type: "SET_SUPPLIER"; value: string }
//   | { type: "SET_ORDER_DATE"; value: string }
//   | { type: "SET_SHIPPING_FEE"; value: number }
//   | { type: "SET_REMARKS"; value: string }
//   | { type: "SET_SUGGESTIONS"; index: number; suggestions: InventoryItem[] }
//   | { type: "CLEAR_SUGGESTIONS"; index: number }
//   | { type: "SET_FOCUSED_FIELD"; index: number; field: string }
//   | { type: "CLEAR_FOCUSED_FIELD" }
//   | { type: "LOCK_ITEM_FIELDS"; index: number; fields: (keyof OrderItemState['readOnlyFields'])[] }
//   | { type: "UNLOCK_ITEM_FIELDS"; index: number; fields: (keyof OrderItemState['readOnlyFields'])[] }
//   | { type: "RESET_ITEM_LOCK_STATUS"; index: number }
//   | { type: "SET_HIGHLIGHTED_SUGGESTION"; index: number }
//   | { type: "INCREMENT_HIGHLIGHTED_SUGGESTION" }
//   | { type: "DECREMENT_HIGHLIGHTED_SUGGESTION" }
//   | { type: "CLEAR_HIGHLIGHTED_SUGGESTION" };

// const initialOrderItem: OrderItemState = {
//   itemCode: "",
//   itemName: "",
//   category: "",
//   modelNumber: "",
//   manufacturer: "",
//   price: 0,
//   quantity: 1,
//   remarks: "",
//   location: "",
//   autoSuggestRequired: false,
//   readOnlyFields: {
//     itemName: false,
//     category: false,
//     modelNumber: false,
//     manufacturer: false,
//     location: false
//   },
// };

// export const initialState: OrderFormState = {
//   items: [JSON.parse(JSON.stringify(initialOrderItem))], // ディープコピーで初期化
//   supplier: "",
//   orderDate: "",
//   shippingFee: 0,
//   remarks: "-",
//   suggestionsMap: {},
//   focusedField: null,
//   highlightedSuggestionIndex: -1,
// };

// export function orderFormReducer(state: OrderFormState, action: OrderFormAction): OrderFormState {
//   switch (action.type) {
//     case "UPDATE_ITEM_FIELD": {
//       const newItems = state.items.map((item, i) => {
//         if (i === action.index) {
//           const updatedItem = { ...item, [action.field]: action.value };

//           // itemCodeが変更されたら、関連フィールドのロックを解除
//           // サジェスト選択時にもここを通るので、サジェスト選択時はロックを維持したい場合は調整が必要
//           if (action.field === "itemCode" && action.value !== item.itemCode) {
//             return {
//               ...updatedItem,
//               readOnlyFields: {
//                 itemName: false,
//                 category: false,
//                 modelNumber: false,
//                 manufacturer: false,
//                 location: false,
//               },
//             };
//           }
//           return updatedItem;
//         }
//         return item;
//       });
//       return { ...state, items: newItems };
//     }
//     case "ADD_ITEM":
//       return {
//         ...state,
//         items: [...state.items, JSON.parse(JSON.stringify(initialOrderItem))],
//         highlightedSuggestionIndex: -1, // 新しいアイテム追加時はハイライトをリセット
//       };
//     case "REMOVE_ITEM":
//       return { ...state, items: state.items.filter((_, i) => i !== action.index) };
//     case "SET_SUPPLIER":
//       return { ...state, supplier: action.value };
//     case "SET_ORDER_DATE":
//       return { ...state, orderDate: action.value };
//     case "SET_SHIPPING_FEE":
//       return { ...state, shippingFee: action.value };
//     case "SET_REMARKS":
//       return { ...state, remarks: action.value };
//     case "SET_SUGGESTIONS":
//       return {
//         ...state,
//         suggestionsMap: { ...state.suggestionsMap, [action.index]: action.suggestions },
//         highlightedSuggestionIndex: -1, // サジェスト更新時はハイライトをリセット
//       };
//     case "CLEAR_SUGGESTIONS":
//       const newSuggestionsMap = { ...state.suggestionsMap };
//       delete newSuggestionsMap[action.index];
//       return { ...state, suggestionsMap: newSuggestionsMap };
//     case "SET_FOCUSED_FIELD":
//       return { ...state, focusedField: { index: action.index, field: action.field } };
//     case "CLEAR_FOCUSED_FIELD":
//       return { ...state, focusedField: null, highlightedSuggestionIndex: -1 };
//     case "LOCK_ITEM_FIELDS":
//       return {
//         ...state,
//         items: state.items.map((item, i) => {
//           if (i === action.index) {
//             const newReadOnlyFields = { ...item.readOnlyFields };
//             action.fields.forEach((field) => {
//               if (!item.itemCode) return; // itemCodeがない場合はロックしない
//               newReadOnlyFields[field] = true;
//             });
//             return { ...item, readOnlyFields: newReadOnlyFields };
//           }
//           return item;
//         }),
//       };
//     case "UNLOCK_ITEM_FIELDS":
//       return {
//         ...state,
//         items: state.items.map((item, i) => {
//           if (i === action.index) {
//             const newReadOnlyFields = { ...item.readOnlyFields };
//             action.fields.forEach((field) => {
//               newReadOnlyFields[field] = false;
//             });
//             return { ...item, readOnlyFields: newReadOnlyFields };
//           }
//           return item;
//         }),
//       };
//     case "RESET_ITEM_LOCK_STATUS":
//         return {
//             ...state,
//             items: state.items.map((item, i) => {
//                 if (i === action.index) {
//                     return {
//                         ...item,
//                         readOnlyFields: { ...initialOrderItem.readOnlyFields }, // 初期状態に戻す
//                     };
//                 }
//                 return item;
//             }),
//         };
//     case "SET_HIGHLIGHTED_SUGGESTION":
//         return { ...state, highlightedSuggestionIndex: action.index };
//     case "INCREMENT_HIGHLIGHTED_SUGGESTION":
//         if (!state.focusedField || !state.suggestionsMap[state.focusedField.index]) {
//             return { ...state, highlightedSuggestionIndex: -1 };
//         }
//         const currentSuggestions = state.suggestionsMap[state.focusedField.index];
//         const nextIndex = (state.highlightedSuggestionIndex + 1) % currentSuggestions.length;
//         return { ...state, highlightedSuggestionIndex: nextIndex };
//     case "DECREMENT_HIGHLIGHTED_SUGGESTION":
//         if (!state.focusedField || !state.suggestionsMap[state.focusedField.index]) {
//             return { ...state, highlightedSuggestionIndex: -1 };
//         }
//         const prevSuggestions = state.suggestionsMap[state.focusedField.index];
//         const prevIndex = (state.highlightedSuggestionIndex - 1 + prevSuggestions.length) % prevSuggestions.length;
//         return { ...state, highlightedSuggestionIndex: prevIndex };
//     case "CLEAR_HIGHLIGHTED_SUGGESTION":
//         return { ...state, highlightedSuggestionIndex: -1 };
//     default:
//       return state;
//   }
// }