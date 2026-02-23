import { ProductRepository } from "../repositories/product.repository";

export class ProdcutService{
  private repository :ProductRepository
  constructor() {
    this.repository = new ProductRepository()
  }

  async  getProduct(){
    return this.repository.getAll()
  }

  async createProdcut (data:any){
     if (!data.name) throw new Error("Name is required");
    if (!data.price) throw new Error("Price is required");
    return this.repository.create(data);
  }
  async getOneProduct (id:string){
    if (!id) throw new Error("id is required");
    return this.repository.getOne(id);
  }
  async updateProduct(id: string, data: any){
    if (!id) throw new Error("id is required");
    return this.repository.update(id, data);
  }

  async deleteProduct(id: string){
    if (!id) throw new Error("id is required");
    return this.repository.delete(id);
  }
}