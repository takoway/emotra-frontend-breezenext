// バックエンドのレスポンスに基づく型定義
export interface DiaryApiResponse {
    message: string;
    data: DiaryData;
}

export interface DiaryData {
    userId: number;
    date: string;
    mental: number;
    diary: string;
}
