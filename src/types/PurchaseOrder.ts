import { InventoryPurchaseOrderDetailRequest, AssetPurchaseOrderDetailRequest } from "@/types/PurchaseOrderDetail"

// ============== リクエストの型 ================

// 発注登録リクエストの基底プロパティ
interface BasePurchaseOrderHeader {
  supplier: string;
  orderDate: string;
  shippingFee: number;
  discount?: number;
  remarks?: string;
}

// 発注登録リクエストのうち在庫品特有のプロパティ
export interface InventoryPurchaseOrderRequest extends BasePurchaseOrderHeader {
  oderType: "INVENTORY"; // 識別子: "INVENTORY" 固定
  details: InventoryPurchaseOrderDetailRequest[]; // 在庫品の明細のみを許容
}

// 発注登録リクエストのうち設備品特有のプロパティ
export interface AssetPurchaseOrderRequest extends BasePurchaseOrderHeader {
  oderType: "ASSET"; // 識別子: "ASSET" 固定
  calibrationCert: number; // 校正証明書データ料
  traceabilityCert: number; // トレーサビリティ証明書データ料
  details: AssetPurchaseOrderDetailRequest[]; // 設備品と関連サービスの明細のみを許容
}


//========= 以下 フォームの状態の型　===========//

// 発注フォーム内共通入力項目の入力状態の基底プロパティ
interface BasePurchaseOrderFormState {
  supplier: string;
  orderDate: string;
  shippingFee: number;
  discount?: number;
  remarks: string | "";
}

// 在庫発注フォームの共通項目入力状態
export interface InventoryPurchaseOrderFormState extends BasePurchaseOrderFormState {
  orderType: "INVENTORY";
  details: InventoryPurchaseOrderDetailFormState[];
}

// 設備発注フォームの共通項目入力状態
export interface AssetPurchaseOrderFormState extends BasePurchaseOrderFormState {
  orderType: "ASSET";
  calibrationCert?: string;
  traceabilityCert?: string;
  details: AssetPurchaseOrderDetailFormState[];
}


//========= 以下 旧定義　===========//

// 在庫発注登録のリクエスト型定義
export interface PurchaseOrderRequest {
  supplier: string;
  shippingFee: number;
  oderType: string;          // 発注区分 "INVENTORY" or "ASSET"
  remarks?: string;
  orderDate?: string;
  details: PurchaseOrderDetailRequest[];
}

// 在庫登録リクエスト型定義
export interface PurchaseOrderDetailRequest {
  itemCode?: string;
  itemName?: string;
  modelNumber?: string;
  manufacturer?: string;
  category: string;
  price: number;
  itemType: string; // 商品種別ITEM SERVICE (在庫品発注の場合は"ITME"統一)
  quantity: number;
  location: string;
  remarks: string;
}

// 在庫・設備発注情報のレスポンス型
export interface PurchaseOrderResponse {
  orderNo: string;
  supplier: string;
  orderSubtotal: number;
  discount: number;
  orderDate: string;
  shippingFee: number;
  status: string;
  calibrationCert: number; // 校正証明書データ料
  traceabilityCert: number;  // トレーサビリティ証明書データ料
  remarks?: string;

  details?: PurchaseOrderDetailResponse[];
}

//  在庫・設備発注情報のレスポンス型
export interface PurchaseOrderDetailResponse {
  id: number | null;
  orderNo: string; // どの発注の明細か
  itemCode: string;
  itemName: string;
  modelNumber: string;
  category: string;
  purchasePrice: number;
  quantity: number;
  status: string; // 納品済みかなど
  receivedQuantity?: number; // 納品数など追加用途
}
