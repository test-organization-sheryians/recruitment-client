"use client";
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/api/backendProducts/getAllProducts';

export const useProducts = () => {
  return useQuery({
    queryKey: ['getAllProducts'],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};