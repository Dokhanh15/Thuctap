// Product type
export type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  isShow: boolean;
  rating: {
    count: number;
    rate: number;
  };
  sizes?: string[]; // Danh sách kích thước
  colors?: string[]; // Danh sách màu sắc (mã hex)
};

// Category type
export type Category = {
  _id: string;
  name: string;
  image: string;
  description: string;
};

// ProductFormParams type
export type ProductFormParams = {
  title: string;
  price: number;
  image: string;
  description: string;
  category: string; 
  isShow: boolean;
};

// Định nghĩa kiểu cho sản phẩm trong giỏ hàng
export interface CartProduct {
  product: Product; // Sản phẩm thuộc loại Product
  quantity: number; // Số lượng sản phẩm
}

// Định nghĩa kiểu cho giỏ hàng
export interface Cart {
  _id: string; // ID của giỏ hàng
  user: string; // ID của người dùng (hoặc user object nếu cần chi tiết hơn)
  products: CartProduct[]; // Danh sách sản phẩm trong giỏ hàng
}
