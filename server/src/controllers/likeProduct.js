// controllers/userController.js
import User from '../models/UserModel.js';
import Product from '../models/ProductModel.js';
import Category from "../models/CategoryModel";


// Thêm sản phẩm vào danh sách đã thích
// Thêm sản phẩm vào danh sách đã thích
export const likeProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        // Cập nhật danh sách đã thích
        await User.findByIdAndUpdate(userId, { $addToSet: { likedProducts: productId } });
        res.status(200).json({ message: 'Sản phẩm đã được thích!' });
    } catch (err) {
        console.error("Error in likeProduct:", err);
        res.status(500).json({ message: err.message });
    }
};

// Bỏ thích sản phẩm
export const unlikeProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        await User.findByIdAndUpdate(userId, { $pull: { likedProducts: productId } });
        res.status(200).json({ message: 'Sản phẩm đã được bỏ thích!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy danh sách sản phẩm đã thích của người dùng với tìm kiếm và lọc
export const getLikedProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { category, query } = req.query;

        // Lấy danh sách sản phẩm đã thích của người dùng
        const user = await User.findById(userId).populate('likedProducts');
        let likedProducts = user.likedProducts;

        // Nếu có tham số tìm kiếm, lọc các sản phẩm
        if (query) {
            likedProducts = likedProducts.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Nếu có tham số danh mục, lọc các sản phẩm theo danh mục
        if (category) {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) {
                likedProducts = likedProducts.filter(product =>
                    product.category.equals(categoryDoc._id)
                );
            } else {
                likedProducts = [];
            }
        }

        res.status(200).json(likedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
