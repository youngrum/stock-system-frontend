// lib/utils/dateFormat.ts

/**
 * ISO文字列から「yyyy-MM-dd」形式の日付文字列を返す
 * @param isoString ISOフォーマット文字列（例: "2025-05-19T12:10:15.154002"）
 */
export const formatDate = (isoString: string): string => {
    if (!isoString) return '';
    // 日本時間として解釈し、ローカル日付を取得
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };