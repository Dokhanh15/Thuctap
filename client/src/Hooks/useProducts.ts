import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useStatus } from "src/contexts/Status";
import { Product } from "src/types/products";

export const useProduct = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>();
  // const { setLoading } = useStatus();
  const {setLoading} = useStatus();
  const { setLoading: setGlobalLoading } = useStatus();

  const getAllProduct = useCallback(async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);
      const { data } = await axios.get<Product[]>("/products");
      setProducts(data);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  const totalProduct = useMemo(() => products.length, [products]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const getProductDetail = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Xóa nha?")) {
      try {
        setLoading(true);
        await axios.delete(`/products/${id}`);
        getAllProduct();
      } catch (error) {
        toast.error((error as AxiosError)?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddProduct = async (data: Product) => {
    try {
      setLoading(true);
      await axios.post("/products", data);
      alert("OK");
      nav("/admin/product/list");
    } catch (error) {
      toast.error((error as AxiosError)?.message);
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
      toast.error((error as AxiosError)?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
