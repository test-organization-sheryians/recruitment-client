export  class Prodcut {
  constructor (
   public _id:string,
   public name:string,
   public description:string,
   public price:number,
   public stock:number,
   public category:string
  ) {}

  isInStock():boolean{
    return this.stock > 0

  }

  formattedPrice():string{
    return `₹${this.price}`;
  }

}