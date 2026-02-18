export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
