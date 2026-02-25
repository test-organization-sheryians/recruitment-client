import { apiClient } from "@/lib/product.api";
import { Prodcut } from "../domin/Prodcut";

export class ProductRepository {

  async getAll(): Promise<Prodcut[]> {
    const res = await apiClient.get("/product");

    return res.data.data.map((p: any) =>
      new Prodcut(
        p._id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category
      )
    );
  }

  async create(data: any): Promise<Prodcut> {
    const res = await apiClient.post("/product", data)

    const p = res.data.data

    return new Prodcut(
      p._id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.category

    )

  }

  async getOne(id: string): Promise<Prodcut> {
    const res = await apiClient.get(`/product/${id}`);

    const p = res?.data?.data;

    return new Prodcut(
      p._id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.category
    );
  }

  async update(id: string, data: any): Promise<Prodcut> {
    const res = await apiClient.patch(`/product/${id}`, data);
    const p = res?.data?.data;
    return new Prodcut(p._id, p.name, p.description, p.price, p.stock, p.category);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/product/${id}`);
  }

}