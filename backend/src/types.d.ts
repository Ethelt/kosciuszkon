export type BaseApiResponse<T = any> = BaseApiSuccessResponse<T> | BaseApiErrorResponse<T>;

export type BaseApiSuccessResponse<T = any> = {
    success: boolean;
    data: T;
}

export type BaseApiErrorResponse = {
    success: false;
    error: string;
}