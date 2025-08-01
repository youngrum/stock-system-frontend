
//========= 以下 リクエストの型　===========//
// // ベース
// 発注明細リクエストの基底プロパティ
interface BasePurchaseOrderDetailRequest {
  itemName:string;
  modelNumber:string;
  manufacturer: string;
  category: string;
  purchasePrice: number;    // 商品単価
  quantity: number;
  remarks?: string;
}

// 在庫発注
// 発注明細リクエストのうち在庫品固有のプロパティ
export interface InventoryPurchaseOrderDetailRequest extends BasePurchaseOrderDetailRequest {
  itemType: "ITEM";  // ITEM統一
  itemCode?: string; // itemTypeがITEMならitemCodeは必須にするなど
  location: string;  // 在庫品の保管場所
}

// 設備発注
// 発注明細リクエストのうち設備品固有のプロパティ(新規購入タブ)
interface AssetItemPurchaseOrderDetailRequest extends BasePurchaseOrderDetailRequest {
  itemType: "ITEM";
  services: CalibrationOrderRequest[];
}

// 設備発注
// 設備購入に伴う校正の発注明細リクエスト型(新規購入タブ)
// 新規設備発注の校正単価への入力をトリガーにこのオブジェクトを生成してリクエストに含める
export interface CalibrationOrderRequest {
  itemName: string;
  serviceType: "CALIBRATION"; // サービス区分
  purchasePrice: number;      // 校正単価(calibrationPrice) 
  quantity: number,           // 数量 = 親の発注明細の数量
}

// 設備発注
// 発注明細リクエストのうち校正・修理依頼固有のプロパティ(校正・修理タブ)
interface AssetServicePurchaseOrderDetailRequest {
  itemName: string;
  itemType: "SERVICE";
  serviceType: string;     // CALIBRATION / REPAIR
  relatedAssetId: number; // 既存設備への紐づけ用
  serialNumber: string | undefined; // 発注名称に記載するため
  purchasePrice: number;
  remarks: string;
}

// 設備発注
// 新規設備購入・既存設備修理の2フォームのリクエスト型をUnion型で提供
export type AssetPurchaseOrderDetailRequest = AssetItemPurchaseOrderDetailRequest | AssetServicePurchaseOrderDetailRequest;


//========= 以下 フォームの入力状態の型　===========//

// ベース
// 発注明細入力状態の基底プロパティ
interface BasePurchaseOrderDetailFormState {
  itemName:string | undefined;
  modelNumber:string | undefined;
  manufacturer: string | undefined;
  category: string | undefined;
  purchasePrice: number;    // 商品単価
  quantity: number;
  remarks?: string | undefined;
}

// 在庫発注
// 発注明細入力状態のうち在庫品固有のプロパティ
export interface InventoryPurchaseOrderDetailFormState extends BasePurchaseOrderDetailFormState {
  itemType: "ITEM";  // ITEM統一
  itemCode: string | undefined;
  location: string | undefined;  // 在庫品の保管場所
}

// リクエストには必要だが状態の型定義には不要
// 設備発注
// 発注明細入力状態のうち設備品固有のプロパティ(新規購入タブ)
interface AssetItemPurchaseOrderDetailFormState extends BasePurchaseOrderDetailFormState {
  itemType: "ITEM";  // ITEM統一
  calibrationPrice: number;
  // services?: CalibrationOrderState[];
}

// 設備発注
// 設備購入に伴う校正の発注明細入力状態型(新規購入タブ)
// export interface CalibrationOrderFormState {
//   itemName: string | undefined;
//   itemType: "SERVICE";
//   serviceType: "CALIBRATION"; // サービス区分
//   purchasePrice: number;      // 校正単価 新規設備発注時に入力可能
//   quantity: number,           // 数量 = 親の発注明細の数量
// }

// 設備発注
// 発注明細入力状態のうち校正・修理依頼固有のプロパティ(校正・修理タブ)
interface AssetServicePurchaseOrderDetailFormState {
  itemType: "SERVICE";
  serviceType: string | undefined;  // CALIBRATION / REPAIR
  assetCode: string | undefined;    // 既存設備検索用
  relatedAssetId: number | undefined; // 既存設備への紐づけ用 バックエンドで使用
  purchasePrice: number;
  remarks: string;
}

// 設備発注
// 新規設備購入・既存設備修理の2フォームのリクエスト型をUnion型で提供
export type AssetPurchaseOrderDetailFormState = AssetItemPurchaseOrderDetailFormState | AssetServicePurchaseOrderDetailFormState;
