// Product type
// Product type
export type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: Category;
  rating: {
    count: number;
    rate: number;
  };
  discountPercentage?: number; 
  saleStartDateTime: string;
  saleEndDateTime?: string; 
  sizes?: string[]; 
  colors?: string[]; 
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
  _id?: string; // Có thể không có nếu tạo mới sản phẩm
  title: string;
  price: number;
  image: string | File | null;
  description: string;
  category: string;
  discountPercentage?: number; 
  saleStartDateTime: string;
  saleEndDateTime?: string; 
  sizes?: string[]; // Danh sách kích thước (tùy chọn)
  colors?: string[]; // Danh sách màu sắc (tùy chọn)
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
