import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "src/contexts/loading";
import { Product } from "src/types/Product";

export const useProduct = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>();
  const [error, setError] = useState<string>("");
  const { setLoading } = useLoading();

  const getAllProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (error) {
      setError((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const totalProduct = useMemo(() => products.length, [products]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const getProductDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      setError((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    if (window.confirm("Xóa nha?")) {
      try {
        setLoading(true);
        await axios.delete(`/products/${id}`);
        getAllProduct();
      } catch (error) {
        setError((error as AxiosError)?.message);
      } finally {
        setLoading(false);
      }
    }
  }, [getAllProduct, setLoading]);

  const handleAddProduct = async (data: Product) => {
    try {
      setLoading(true);
      await axios.post("/products", data);
      alert("OK");
      nav("/admin/product/list");
    } catch (error) {
      setError((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (data: Product) => {
    try {
      setLoading(true);
      await axios.put(`/products/${id}`, data);
      alert("OK");
      nav("/admin/product/list");
    } catch (error) {
      setError((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    products,
    product,
    totalProduct,
    getAllProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleEditProduct,
    getProductDetail,
  };
};
