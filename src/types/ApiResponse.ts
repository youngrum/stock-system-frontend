// 成功時
export interface ApiSuccessResponse<T> {
    status: number
    message: string
    data: T
}
  
// エラー時
export interface ApiErrorResponse {
    timestamp: string
    status: number
    error: string
    message: string
    path: string
}
  