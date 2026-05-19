// import axios from "axios";
// import { backendProducts, CreateProductInput, UpdateProductInput } from "../../types/backendProducts"; // Assuming your types are here
// import api from "@/config/axios";

// export const ProductService = {
//   // GET ALL
//   getProducts: async (): Promise<backendProducts[]> => {
//     const response = await api.get<backendProducts[]>("/getAllProducts");
//     return response.data;
//   },

//   // GET SINGLE PRODUCT (The new addition)
//   getSingleProduct: async (id: string): Promise<backendProducts> => {
//     try {
//       const response = await api.get<backendProducts>(`//getSingleProduct${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching product with ID ${id}:`, error);
//       throw error; // Rethrow so the UI can handle the error state
//     }
//   },

//   // CREATE
//   createProduct: async (product: CreateProductInput): Promise<backendProducts> => {
//     const response = await api.post<backendProducts>("/create", product);
//     return response.data;
//   },

//   // UPDATE
//   updateProduct: async (id: string, updates: UpdateProductInput): Promise<backendProducts> => {
//     const response = await api.put<backendProducts>(`//updateProduct${id}`, updates);
//     return response.data;
//   },

//   // DELETE
//   deleteProduct: async (id: string): Promise<void> => {
//     await api.delete(`//deleteProduct${id}`);
//   }
// };