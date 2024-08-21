import { StatusCodes } from "http-status-codes";
import Product from "../models/ProductModel";
import ApiError from "../utils/ApiError";
import Category from "../models/CategoryModel";

class ProductsController {
  // GET /products
  async getAllProducts(req, res, next) {
    try {
      const { category, query } = req.query; // Lấy tham số category từ query string
      let filter = {};
      if (category) {
        // Tìm ObjectId của category dựa trên tên của nó
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          return res.status(StatusCodes.OK).json([]);
        }
      }
      if (query) {
        filter.title = { $regex: query, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
      }
      const products = await Product.find(filter).populate("category");
      res.status(StatusCodes.OK).json(products);
    } catch (error) {
      next(error);
    }
  }


  // GET /products/:id
  async getProductDetail(req, res, next) {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );

      if (!product) throw new ApiError(404, "Product Not Found");
      res.status(StatusCodes.OK).json(product);
    } catch (error) {
      next(error);
    }
  }
  // POST /products
  async createProduct(req, res, next) {
    try {
      const newProduct = await Product.create(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Create Product Successfull",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }
  // PUT /products/:id
  async updateProduct(req, res, next) {
    try {
      const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("category");
      if (!updateProduct) throw new ApiError(404, "Product Not Found");

      res.status(StatusCodes.OK).json({
        message: "Update Product Successfull",
        data: updateProduct,
      });
    } catch (error) {
      next(error);
    }
  }
  // DELETE /products/:id
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) throw new ApiError(404, "Product Not Found");
      res.status(StatusCodes.OK).json({
        message: "Delete Product Done",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsController;
