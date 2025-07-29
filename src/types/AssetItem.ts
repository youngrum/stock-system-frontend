// 1つの設備品レコードの型
export interface AssetIetm {
    id: long;
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
    id: long;
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

// 在庫検索リクエストのパラメータ型定義
export interface InventorySearchParams {
  assetCode?: string; // 管理番号
  assetName?: string; // 設備名
  category?: string;  // カテゴリー
  modelNumber?: string; // 型番
}

// 設備品登録のリクエスト型定義
export interface UpdateAssetRequest {
  id: long;                       // id
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