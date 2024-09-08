import { Product } from "./products";

export interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  calculateSubtotal: (price: number, quantity: number) => number;
}