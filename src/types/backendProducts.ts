export interface backendProducts {
  _id: string; // MongoDB ObjectID as a string
  name: string;
  description: string;
  price: number;
  ratings: number;
  seller: string;
  stock: number;
  createdAt: string | Date; // ISO date string from backend
  updatedAt: string | Date;
  __v: number; // Mongoose version key
}
export type CreateProductInput = Omit<backendProducts, "_id" | "createdAt" | "updatedAt" | "__v">;
export type UpdateProductInput = Partial<CreateProductInput>;