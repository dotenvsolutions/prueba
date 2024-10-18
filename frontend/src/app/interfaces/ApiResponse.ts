export interface ApiResponse {
    success: boolean;
    msg: string;
    token ?: string;
    data ? : []
}