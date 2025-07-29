// 1つの設備品レコードの型
export interface AssetItem {
    id: number | null;
    assetCode: string;
    assetName: string;
    manufacturer: string;
    modelNumber:string;
    category:string;
    supplier:string; 
    serialNumber: string;
    registDate: string;
    purchasePrice: number;
    quantity: number;
    status: string;
    location: string;
    lastCalibrationDate: string;
    nextCalibrationDate: string;
    fixedAssetManageNo: string;
    monitored: boolean;
    calibrationRequired: boolean;
    remarks: string;
}

// 設備品一覧のレスポンス型
export interface AssetIetmResponse {
    id: number | null;
    assetCode: string;
    assetName: string;
    manufacturer: string;
    modelNumber:string;
    category:string;
    supplier:string; 
    serialNumber: string;
    registDate: string;
    purchasePrice: number;
    quantity: number;
    status: string;
    location: string;
    lastCalibrationDate: string;
    nextCalibrationDate: string;
    fixedAssetManageNo: string;
    monitored: boolean;
    calibrationRequired: boolean;
    remarks: string;
}

// 設備品検索リクエストのパラメータ型定義
export interface AssetSearchParams {
  assetCode?: string; // 管理番号
  assetName?: string; // 設備名
  category?: string;  // カテゴリー
  modelNumber?: string; // 型番
}

// 設備品一覧から登録済みレコードの更新リクエスト型定義
export interface UpdateAssetRequest {
  id: number | null;              // id
  assetCode: string;              // 設備管理番号
  serialNumber: string;           // 製造番号
  lastCalibrationDate: string;    // 前回校正日
  nextCalibrationDate: string;    // 次回校正日
  fixedAssetManageNo: string;     // 固定資産管理番号
  location: string;               // 保管/設置場所
  registDate: string;             // 登録日
  monitored: boolean;             // 監視対象
  calibrationRequired: boolean;   // 校正要否フラグ
  remarks: string;                // 備考
  status: string;                 // ステータス 廃棄登録時に使用
}

// 設備品手動登録フォームからの新規登録リクエスト型定義
export interface CreateAssetRequest {
  assetCode: string;              // 設備管理番号
  assetName: string;              // 設備名
  manufacturer: string;           // メーカー
  modelNumber: string;            // 型番・規格
  category: string;               // カテゴリー
  supplier: string;               // 仕入れ先
  serialNumber: string;           // 製造番号
  registDate: string;             // 登録日＝リクエストした日を格納
  purchasePrice: number;          // 購入金額
  quantity: number;               // 数量 hiddenで1をリクエスト
  location: string;               // 保管/設置場所
  status: string;                 // ステータス 廃棄登録時に使用
  lastCalibrationDate: string;    // 前回校正日
  nextCalibrationDate: string;    // 次回校正日
  fixedAssetManageNo: string;     // 固定資産管理番号
  monitored: boolean;             // 監視対象
  calibrationRequired: boolean;   // 校正要否フラグ
  remarks: string;                // 備考
}