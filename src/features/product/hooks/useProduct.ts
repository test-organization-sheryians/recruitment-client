"use client"

import React, { useEffect, useState, useMemo } from "react";
import { Prodcut } from "../domin/Prodcut";
import { ProductService } from "../services/product.service";

export function useProducts() {
  const [products, setProducts] = useState<Prodcut[]>([]);
  const service = useMemo(() => new ProductService(), []);

  const reload = () => {
    return service.getProduct().then(setProducts).catch((e) => {
      console.error("useProducts.reload error", e);
      throw e;
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const deleteProduct = async (id: string) => {
    await service.deleteProduct(id);
    await reload();
  };

  return { products, reload, deleteProduct };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Prodcut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const service = useMemo(() => new ProductService(), []);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    service
      .getOneProduct(id)
      .then((p) => {
        if (!mounted) return;
        setProduct(p);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
