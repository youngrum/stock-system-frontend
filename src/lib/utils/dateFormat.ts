// lib/utils/dateFormat.ts

/**
 * ISO文字列から「yyyy-MM-dd」形式の日付文字列を返す
 * @param isoString ISOフォーマット文字列（例: "2025-05-19T12:10:15.154002"）
 */
export const formatDate = (isoString: string): string => {
    if (!isoString) return '';
    return new Date(isoString).toISOString().slice(0, 10);
  };