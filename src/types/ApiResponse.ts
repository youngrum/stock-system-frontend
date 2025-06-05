// 成功時
export interface ApiSuccessResponse<T> {
    status: number
    message: string
    data: T
}
  
// エラー時
export interface ApiErrorResponse {
    timestamp: Date
    status: number
    error: string
    message: string
    path: string
}
  