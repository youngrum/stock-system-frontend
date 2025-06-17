import api from "@/services/api";
import { ApiErrorResponse } from "@/types/ApiResponse";
import React, { useState } from "react";
import Loader from "../ui/Loader";

export default function CsvUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("ファイルを選択してください。");
      return;
    }
    setMessage(""); // メッセージをリセット
    setError(""); // エラーメッセージをリセット

    const formData = new FormData();
    formData.append("file", selectedFile); // 'file' はSpring Boot側で受け取るパラメータ名と合わせる

    try {
      setLoading(true);
      // Spring BootのAPIエンドポイントURLを指定
      const response = await api.post(
        "http://localhost:8080/api/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // onUploadProgress: (progressEvent) => {
          //   // アップロード進捗表示用 (オプション)
          //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //   console.log(`Upload Progress: ${percentCompleted}%`);
          // }
        }
      );
      setMessage(`アップロード成功: ${response.data.message}`);
      setSelectedFile(null); // ファイル選択をクリア
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data: ApiErrorResponse } };
      if (err.response && err.response.data) {
        const error: ApiErrorResponse = err.response.data;
        alert(
          `エラーが発生しました！以下の内容を管理者に伝えてください。\n・error: ${error.error}\n・massage: ${error.message}\n・status: ${error.status}`
        ); // エラーメッセージを利用
      }
      setError("登録に失敗しました。");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div>
        <h2>CSVファイルアップロード</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          アップロード
        </button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
