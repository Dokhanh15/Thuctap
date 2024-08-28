import { StatusCodes } from "http-status-codes";
import Category from "../models/CategoryModel";
import ApiError from "../utils/ApiError";
import Product from "../models/ProductModel";
import cloudinary from "../config/cloudinary";
import fs from "fs";

class CategoriesController {
  // GET /categories
  async getAllCategories(req, res, next) {
    try {
      const categories = await Category.find();
      res.status(StatusCodes.OK).json(categories);
    } catch (error) {
      next(error);
    }
  }
  
  // GET /categories/:id
  async getCategoryDetail(req, res, next) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) throw new ApiError(404, "Category Not Found");
      res.status(StatusCodes.OK).json(category);
    } catch (error) {
      next(error);
    }
  }
  
  // POST /categories
  async createCategory(req, res, next) {
    try {
      let imageUrl = null;
      // Xử lý ảnh nếu có
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'categories',
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(req.file.path); // Xóa ảnh tạm sau khi upload
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh lên Cloudinary:", uploadError);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi upload ảnh lên Cloudinary." });
        }
      }

      const newCategory = await Category.create({
        name: req.body.name,
        description: req.body.description,
        image: imageUrl,
      });

      res.status(StatusCodes.CREATED).json({
        message: "Create Category Successful",
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // PUT /categories/:id
  async updateCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      const categoryId = req.params.id;
  
      let imageUrl= null;
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'categories',
          });
          imageUrl = result.secure_url;
  
          // Xóa ảnh tạm sau khi upload lên Cloudinary
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh lên Cloudinary:", uploadError);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi upload ảnh lên Cloudinary." });
        }
      }
  
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      }
  
      category.name = name || category.name;
      category.description = description || category.description;
  
      if (imageUrl) {
        if (category.image) {
          const publicId = category.image.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(`categories/${publicId}`);
          } catch (deleteError) {
            console.error("Lỗi khi xóa ảnh cũ trên Cloudinary:", deleteError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi xóa ảnh cũ trên Cloudinary." });
          }
        }
        category.image = imageUrl;
      }
  
      await category.save();
      res.status(StatusCodes.OK).json({
        message: "Update Category Successful",
        data: category,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      next(error); 
    }
  }
  
  // DELETE /categories/:id
  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
  
      // Kiểm tra xem danh mục có sản phẩm không
      const products = await Product.find({ category: categoryId });
      if (products.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Category has products and cannot be deleted',
        });
      }
  
      // Tìm và xóa danh mục
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category Not Found' });
      }
  
      // Xóa hình ảnh liên quan trên Cloudinary nếu có
      if (category.image) {
        const publicId = category.image.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`categories/${publicId}`);
        } catch (deleteError) {
          console.error('Error deleting image from Cloudinary:', deleteError);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error deleting image from Cloudinary.',
          });
        }
      }
  
      res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  
}

export default CategoriesController;
