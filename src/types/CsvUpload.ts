export interface UploadResult {
  success: boolean;
  message?: string;
  filename?: string;
  fileSize?: number;
  expectedFormat?: string;
  actualHeader?: string;
  errors?: string[];
  errorCount?: number;
}

export interface CsvTemplateInfo {
  headers: string[];
  headerDescriptions: Record<string, string>;
  example: Record<string, string>;
}
