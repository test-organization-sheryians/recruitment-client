//This represents the car object returned from your backend API.
export interface Car {
  _id: string;
  title: string;
  brand: string;
  price: number;
  year: number;
  fuelType: "petrol" | "diesel" | "electric" | "cng";
  transmission: "manual" | "automatic";
  kmDriven: number;
  createdAt?: string;
  updatedAt?: string;
}

//This represents data sent from frontend → backend.
export interface CreateCarPayload {
  title: string;
  brand: string;
  price: number;
  year: number;
  fuelType: "petrol" | "diesel" | "electric" | "cng";
  transmission: "manual" | "automatic";
  kmDriven: number;
}


//Without optional fields (?), TypeScript would force you to send all fields, which is wrong.
export interface UpdateCarPayload {
  title?: string;
  brand?: string;
  price?: number;
  year?: number;
  fuelType?: "petrol" | "diesel" | "electric" | "cng";
  transmission?: "manual" | "automatic";
  kmDriven?: number;
}
