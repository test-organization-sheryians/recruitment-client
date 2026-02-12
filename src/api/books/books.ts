
export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  category: 'Fiction' | 'Non-Fiction' | 'Education' | 'Biography' | 'Comics';
  stock?: number;          // optional
  isAvailable?: boolean;   // optional
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  isbn: string;
  price: number;
  category: 'Fiction' | 'Non-Fiction' | 'Education' | 'Biography' | 'Comics';
  stock?: number;
  isAvailable?: boolean;
}

