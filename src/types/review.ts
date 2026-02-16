export interface Review {
  _id: string;

  productId: string;
  userId: string;

  rating: number;
  comment?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  id: string;
  productId: string;
  rating?: number;
  comment?: string;
  isActive?: boolean;
}

export interface DeleteReviewPayload {
  id: string;
  productId: string;
}
