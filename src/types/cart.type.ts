export interface CartItem {
  _id: string;      // ✅ MongoDB ID
  product: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
