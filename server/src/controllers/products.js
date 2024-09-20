import { StatusCodes } from "http-status-codes";
import Product from "../models/ProductModel";
import ApiError from "../utils/ApiError";
import Category from "../models/CategoryModel";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import mongoose from "mongoose";

class ProductsController {
  // GET /products
  async getAllProducts(req, res, next) {
    try {
      const { category, query } = req.query;
      let filter = {};
  
      if (category) {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          return res.status(StatusCodes.OK).json([]);
        }
      }
      if (query) {
        filter.title = { $regex: query, $options: "i" };
      }
  
      // Lấy tất cả sản phẩm
      const products = await Product.find(filter).populate("category");
  
      // Xóa thông tin sale đã hết hạn
      const now = new Date();
      for (let product of products) {
        if (product.saleEndDateTime && new Date(product.saleEndDateTime) < now) {
          product.discountPercentage = undefined;
          product.saleStartDateTime = undefined;
          product.saleEndDateTime = undefined;
          await product.save(); // Lưu lại các thay đổi
        }
      }
  
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

  async createProduct(req, res, next) {
    try {
      const {
        title,
        description,
        price,
        category,
        discountPercentage,
        saleStartDateTime,
        saleEndDateTime,
      } = req.body;
      const image = req.file ? req.file.path : null;

      let imageUrl;
      if (image) {
        try {
          const result = await cloudinary.uploader.upload(image, {
            folder: "products",
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(image);
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh:", uploadError);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Lỗi khi upload ảnh." });
        }
      }

      const newProduct = await Product.create({
        title,
        description,
        price,
        category: new mongoose.Types.ObjectId(category),
        image: imageUrl,
        discountPercentage,
        saleStartDateTime,
        saleEndDateTime,
      });

      res.status(StatusCodes.CREATED).json({
        message: "Tạo sản phẩm thành công",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /products/:id
  async updateProduct(req, res) {
    try {
      const {
        title,
        description,
        price,
        category,
        discountPercentage,
        saleStartDateTime,
        saleEndDateTime,
      } = req.body;
      const productId = req.params.id;

      let imageUrl;
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "products",
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh:", uploadError);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Lỗi khi upload ảnh." });
        }
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Product not found" });
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;

      // Xóa thông tin sale nếu thời gian sale đã hết hạn
      const now = new Date();
      if (saleEndDateTime && new Date(saleEndDateTime) < now) {
        product.discountPercentage = undefined;
        product.saleStartDateTime = undefined;
        product.saleEndDateTime = undefined;
      } else {
        product.discountPercentage =
          discountPercentage || product.discountPercentage;
        product.saleStartDateTime =
          saleStartDateTime || product.saleStartDateTime;
        product.saleEndDateTime = saleEndDateTime || product.saleEndDateTime;
      }

      if (imageUrl) {
        if (product.image) {
          const publicId = product.image.split("/").pop().split(".")[0];
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (deleteError) {
            console.error("Lỗi khi xóa ảnh cũ:", deleteError);
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "Lỗi khi xóa ảnh cũ." });
          }
        }
        product.image = imageUrl;
      }

      await product.save();
      res
        .status(StatusCodes.OK)
        .json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  // DELETE /products/:id
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) throw new ApiError(404, "Product Not Found");

      // Xóa ảnh khỏi Cloudinary nếu có
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      res.status(StatusCodes.OK).json({
        message: "Delete Product Done",
      });
    } catch (error) {
      next(error);
    }
  }

  async removeExpiredSales() {
    try {
      const now = new Date();
      const expiredProducts = await Product.updateMany(
        {
          saleEndDateTime: { $lt: now },
        },
        {
          $unset: {
            discountPercentage: "",
            saleStartDateTime: "",
            saleEndDateTime: "",
          },
        }
      );

      console.log(
        `Đã xóa thông tin sale cho ${expiredProducts.modifiedCount} sản phẩm.`
      );
    } catch (error) {
      console.error("Lỗi khi xóa thông tin sale đã hết hạn:", error);
    }
  }
}

export default ProductsController;
