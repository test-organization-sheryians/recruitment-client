"use client";
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/api/getProducts/productApi';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};