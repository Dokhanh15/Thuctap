import { StatusCodes } from "http-status-codes";
import Category from "../models/CategoryModel";
import ApiError from "../utils/ApiError";
import Product from "../models/ProductModel";

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
      const newCategory = await Category.create(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "Create Category Successfull",
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // PUT /categories/:id
  async updateCategory(req, res, next) {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!category) throw new ApiError(404, "Category Not Found");
      res.status(StatusCodes.OK).json({
        message: "Update Category Successfull",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // DELETE /categories/:id
  async deleteCategory (req, res) {
    try {
      const categoryId = req.params.id;
      const products = await Product.find({ category: categoryId });
  
      if (products.length > 0) {
        return res.status(400).json({ message: 'Category has products and cannot be deleted' });
      }
  
      const category = await Category.findByIdAndDelete(categoryId);
  
      if (!category) {
        return res.status(404).json({ message: 'Category Not Found' });
      }
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
}

export default CategoriesController;
