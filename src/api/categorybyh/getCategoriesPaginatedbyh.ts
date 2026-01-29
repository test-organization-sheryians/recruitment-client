import api from '@/config/axios'

export interface BackendPagination {
    currentPage: number;
    limit: number;
    totalRecords: number;
    totalPages: number
}

export interface BackendPaginatedResponse<T> {
    success?: boolean;
    data: T[];
    pagination: BackendPagination;
    message?: string;
}

export interface CategoryItem {
    _id: string;
    name: string;
}

export const getCategoriesPaginatedbyh = async (
    page: number,
    limit: number
): Promise<BackendPaginatedResponse<CategoryItem>> => {
    const res = await api.get('/api/hjob-categories', { params: { page, limit } });

    // Production-level response validation and normalization
    let responseData = res.data;

    // Handle cases where the backend might wrap the response in an additional layer
    // e.g., { data: { data: [...], pagination: {...} } }
    if (responseData?.data && Array.isArray(responseData.data?.data)) {
        console.warn('⚠️ Detected nested data structure, unwrapping...');
        responseData = responseData.data;
    }

    // Validate the response structure
    if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format: expected an object');
    }

    if (!Array.isArray(responseData.data)) {
        throw new Error('Invalid response format: data must be an array');
    }

    if (!responseData.pagination || typeof responseData.pagination !== 'object') {
        console.warn('⚠️ Missing pagination metadata, using defaults');
        responseData.pagination = {
            currentPage: page,
            limit,
            totalRecords: responseData.data.length,
            totalPages: 1
        };
    }

    return responseData as BackendPaginatedResponse<CategoryItem>;
}