import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
import api from "@/services/api";
import { ApiErrorResponse } from "@/types/ApiResponse";
import Loader from "@/components/ui/Loader";
import { UploadResult, CsvTemplateInfo } from "@/types/CsvUpload";

function CsvUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const [templateInfo, setTemplateInfo] = useState<CsvTemplateInfo | null>(
    null
  );
  const [showTemplateInfo, setShowTemplateInfo] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // ファイル拡張子とMIMEタイプのチェック
      const fileName = file.name.toLowerCase();
      const allowedExtensions = [".csv"];
      const allowedMimeTypes = ["text/csv", "application/csv", "text/plain"];

      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );
      const hasValidMimeType = allowedMimeTypes.includes(file.type);

      if (!hasValidExtension && hasValidMimeType) {
        setError(
          `CSVファイルのみアップロード可能です。選択されたファイル: ${file.name}`
        );
        setSelectedFile(null);
        return;
      }

      // Excelファイルの検出（拡張子は.csvでもMIMEタイプがExcelの場合）
      if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
        setError(
          "Excelファイルは直接アップロードできません。CSVファイルとして保存し直してください。"
        );
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setMessage("");
      setError("");
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("ファイルを選択してください。");
      return;
    }

    setMessage("");
    setError("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await api.post(
        "/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult(response.data);
      setMessage(`アップロード成功: ${response.data.message}`);
      setSelectedFile(null);

      // ファイル入力をクリア
      const fileInput = document.getElementById(
        "csv-file-input"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(
          `エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`
        ); // エラーメッセージを利用
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/csv-template-info");
      setTemplateInfo(response.data);
      setShowTemplateInfo(true);
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        console.error("テンプレート情報の取得エラー:", error);
        setError(error.message || "テンプレート情報の取得に失敗しました。");
      } else {
        setError("テンプレート情報の取得に失敗しました。");
      }
    }finally{
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      // ファイル拡張子とMIMEタイプのチェック
      const fileName = file.name.toLowerCase();
      const allowedExtensions = [".csv"];
      const allowedMimeTypes = ["text/csv", "application/csv", "text/plain"];

      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );
      const hasValidMimeType = allowedMimeTypes.includes(file.type);

      if (!hasValidExtension && hasValidMimeType) {
        setError(
          `CSVファイルのみアップロード可能です。ドロップされたファイル: ${file.name}`
        );
        return;
      }

      // Excelファイルの検出
      if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
        setError(
          "Excelファイルは直接アップロードできません。CSVファイルとして保存し直してください。"
        );
        return;
      }

      setSelectedFile(file);
      setMessage("");
      setError("");
      setUploadResult(null);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="max-w-4xl mx-auto p-6 bg-white">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            在庫CSVファイルアップロード
          </h1>
          <p className="text-gray-600">
            在庫情報が記載されたCSVファイルをアップロードして、在庫マスターに登録できます。
          </p>
        </div>

        {/* テンプレート情報ボタン */}
        <div className="mb-6">
          <button
            onClick={fetchTemplateInfo}
            className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200"
          >
            <Info className="w-4 h-4 mr-2" />
            CSVテンプレート情報を確認
          </button>
        </div>

        {/* テンプレート情報表示 */}
        {showTemplateInfo && templateInfo && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              CSVファイル形式
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">
                  必要な列（ヘッダー）:
                </h4>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <code className="text-sm text-gray-800">
                    {templateInfo.headers.join(", ")}
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-800 mb-2">各列の説明:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(templateInfo.headerDescriptions).map(
                    ([key, desc]) => (
                      <div
                        key={key}
                        className="bg-white p-3 rounded border border-blue-200"
                      >
                        <span className="font-medium text-gray-700">
                          {key}:
                        </span>
                        <span className="ml-2 text-gray-600">{desc}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-800 mb-2">記入例:</h4>
                <div className="bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                  <div className="grid grid-cols-8 gap-2 text-[12px]">
                    {Object.entries(templateInfo.example).map(
                      ([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-medium text-gray-700 mb-1">
                            {key}
                          </div>
                          <div className="text-gray-600">{value}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTemplateInfo(false)}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              閉じる
            </button>
          </div>
        )}

        {/* アップロードエリア */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              selectedFile
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              {selectedFile ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <p className="text-lg font-medium text-green-700 mb-2">
                    ファイルが選択されました
                  </p>
                  <p className="text-gray-600 mb-4">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    ファイルサイズ: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    CSVファイルをドラッグ&ドロップ
                  </p>
                  <p className="text-gray-500 mb-4">または</p>
                </>
              )}

              <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                <FileText className="w-4 h-4 mr-2" />
                ファイルを選択
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* アップロードボタン */}
        <div className="mb-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-colors duration-200 ${
              selectedFile && !loading
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <Loader />
            ) : (
              <span className="flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                CSVファイルをアップロード
              </span>
            )}
          </button>
        </div>

        {/* 成功メッセージ */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-800">{message}</span>
            </div>
            {uploadResult && uploadResult.success && (
              <div className="mt-3 text-sm text-green-700">
                <p>ファイル名: {uploadResult.filename}</p>
                <p>
                  ファイルサイズ:{" "}
                  {uploadResult.fileSize !== undefined
                    ? (uploadResult.fileSize / 1024).toFixed(1)
                    : "-"}{" "}
                  KB
                </p>
              </div>
            )}
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
            {uploadResult && !uploadResult.success && (
              <div className="mt-3 space-y-2">
                {uploadResult.expectedFormat && (
                  <div className="text-sm text-red-700">
                    <p className="font-medium">期待されるフォーマット:</p>
                    <code className="bg-red-100 px-2 py-1 rounded text-xs">
                      {uploadResult.expectedFormat}
                    </code>
                  </div>
                )}
                {uploadResult.actualHeader && (
                  <div className="text-sm text-red-700">
                    <p className="font-medium">実際のヘッダー:</p>
                    <code className="bg-red-100 px-2 py-1 rounded text-xs">
                      {uploadResult.actualHeader}
                    </code>
                  </div>
                )}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="text-sm text-red-700">
                    <p className="font-medium">
                      エラー詳細 ({uploadResult.errorCount}件):
                    </p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {uploadResult.errors.slice(0, 5).map((err, index) => (
                        <li key={index} className="text-xs">
                          {err}
                        </li>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <li className="text-xs text-red-600">
                          ...他 {uploadResult.errors.length - 5} 件のエラー
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            アップロード時の注意事項
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>
              <strong>ファイル形式:</strong>{" "}
              必ずCSVファイル（.csv）をアップロードしてください
            </li>
            <li>
              <strong>Excelファイルの場合:</strong> Excel →
              「名前を付けて保存」→ 「CSV（コンマ区切り）」を選択
            </li>
            <li>
              <strong>文字エンコーディング:</strong> UTF-8で保存してください
            </li>
            <li>
              <strong>ヘッダー行:</strong> 必須です（item_name, model_number,
              category, manufacturer, current_stock, location）
            </li>
            <li>
              <strong>必須項目:</strong>{" "}
              品名（item_name）とカテゴリ（category）は必ず入力してください
            </li>
            <li>
              <strong>在庫数:</strong>{" "}
              数値で入力してください（未設定の場合は0になります）
            </li>
            <li>
              <strong>ファイルサイズ:</strong> 10MB以下にしてください
            </li>
            <li>
              <strong>エラー時の正常な行について:</strong>{" "}
              エラー時は正常な行も登録されません
            </li>
          </ul>
        </div>

        {/* Excelからの変換方法 */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            📋 ExcelファイルをCSVに変換する方法
          </h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Excelでファイルを開く</li>
            <li>「ファイル」→「名前を付けて保存」を選択</li>
            <li>
              「ファイルの種類」で「
              <span className="font-semibold">
                CSV UTF-8（コンマ区切り）(*.csv)
              </span>
              」を選択
            </li>
            <li>保存して、そのCSVファイルをアップロードしてください</li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default function CsvUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <CsvUploadForm />
      </div>
    </div>
  );
}
