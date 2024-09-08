import axios from "axios";
import { useUser } from "src/contexts/user";
import { useCallback } from "react";
import { useCart } from "src/contexts/Card";
import { Cart, Product } from "src/types/products";
import { useStatus } from "src/contexts/Status";

type AddToCart = {
  product: Product;
  quantity: number;
};

export const useProductCart = () => {
  const { user, setUser } = useUser();
  const { cart, setCart } = useCart();
  const { setLoading } = useStatus();

  const getCartUser = useCallback(async () => {
    const userStorage = localStorage.getItem("user") || "{}";
    const user = JSON.parse(userStorage);
    setUser(user);
    if (!user._id) return;
    try {
      setLoading(true)
      const { data } = await axios.get(`/carts/user/${user._id}`);
      setCart(data as Cart);
    } catch (error) {
      console.error("Failed to fetch cart data", error);
    }finally{
      setLoading(false)
    }
  }, [setCart, setUser]);

  const clearCart = useCallback(async () => {
    if (!user || !user._id) return;
    try {
      setCart({ _id: "", user: user._id, products: [] });
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  }, [user, setCart]);

  const addToCart = useCallback(
    async ({ product, quantity }: AddToCart) => {
      if (quantity <= 0 || !user) return;
      try {
        setLoading(true)
        let updatedCart: Cart;
        if (cart && cart._id) {
          const { data } = await axios.put(`/carts/${cart._id}`, {
            product,
            quantity,
            user: user._id,
          });
          updatedCart = data as Cart;
        } else {
          const { data } = await axios.post("/carts", {
            product,
            quantity,
            user: user._id,
          });
          updatedCart = data as Cart;
        }
        const { data } = await axios.get(`/carts/user/${user._id}`);
        updatedCart = data as Cart;
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error adding to cart:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }finally{
        setLoading(false)
      }
    },
    [cart, user, setCart]
  );

  const removeToCart = useCallback(
    async (productId: string) => {
      if (!user || !user._id) {
        console.error("User not logged in or user ID is missing");
        return;
      }
      try {
        setLoading(true)
        const response = await axios.delete(
          `/carts/user/${user._id}/product/${productId}`
        );
        console.log("Remove item response:", response.data);
        await getCartUser();
        if (cart) {
          const updatedCart = {
            ...cart,
            products: cart.products.filter(
              (item) => item.product._id !== productId
            ),
          } as Cart; // Type assertion to ensure compatibility

          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }finally{
        setLoading(false)
      }
    },
    [user, cart, setCart, getCartUser]
  );

  return { addToCart, removeToCart, getCartUser, clearCart };
};
