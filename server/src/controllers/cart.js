import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import Cart from "../models/Cart";
import Product from "../models/ProductModel";

class CartsController {
  // GET /carts
  async getAllCarts(req, res, next) {
    try {
      const carts = await Cart.find().populate({
        path: "products",
        populate: {
          path: "product",
          model: Product,
        },
      });
      res.status(StatusCodes.OK).json(carts);
    } catch (error) {
      next(error);
    }
  }

  // GET /carts/:id
  async getCartDetail(req, res, next) {
    try {
      const cart = await Cart.findById(req.params.id);

      if (!cart) throw new ApiError(404, "Cart Not Found");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }

  // GET /carts/:id
  async getCartUser(req, res, next) {
    try {
      const cart = await Cart.findOne({ user: req.params.id }).populate({
        path: "products",
        populate: {
          path: "product",
          model: Product,
        },
      });
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }


  // POST /carts
  async createCart(req, res, next) {
    try {
      const { quantity, user, product } = req.body;
      const cart = await Cart.findOne({ user });

      if (cart) {
        const productExisted = cart.products.find(
          (item) => item.product == product
        );

        if (productExisted) {
          productExisted.quantity += quantity;
        } else {
          cart.products.push({ product, quantity });
        }

        await cart.save();
        res.status(StatusCodes.OK).json({
          message: "Cart updated successfully",
          data: cart,
        });
      } else {
        const newCart = await Cart.create({
          user,
          products: [
            {
              product,
              quantity,
            },
          ],
        });
        res.status(StatusCodes.CREATED).json({
          message: "Cart created successfully",
          data: newCart,
        });
      }
    } catch (error) {
      next(error);
    }
  }


  // PUT /carts/:id
  async updateCart(req, res, next) {
    try {
      const { quantity, user, product } = req.body;
      const cart = await Cart.findOne({ user });
      if (!cart) throw new ApiError(404, "Cart Not Found");

      const productExisted = cart.products.find(
        (item) => item.product == product._id
      );
      let newProductCart = [];
      if (productExisted) {
        newProductCart = cart.products.map((item) =>
          item.product == product._id
            ? { product, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newProductCart = [...cart.products, { product, quantity }];
      }

      const updateCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { products: newProductCart },
        {
          new: true,
        }
      );
      if (!updateCart) throw new ApiError(404, "Cart Not Found");

      res.status(StatusCodes.OK).json({
        message: "Update Cart Successfull",
        data: updateCart,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProductCart(req, res, next) {
    try {
      const { userId, id } = req.params;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) throw new ApiError(404, "Cart Not Found");

      const newProductCart = cart.products.filter((item) => item.product != id);

      const updateCart = await Cart.findByIdAndUpdate(
        cart._id,
        { products: newProductCart },
        {
          new: true,
        }
      );
      if (!updateCart) throw new ApiError(404, "Cart Not Found");
      res.status(StatusCodes.CREATED).json({
        message: "Delete Product Cart Successfull",
        data: updateCart,
      });
    } catch (error) {
      console.error("Error occurred while removing item from cart:", error);
      next(error);
    }
  }


  // DELETE /carts/:id
  async deleteCart(req, res, next) {
    try {
      const cartId = req.params.id;
      console.log(`Đang cố gắng xóa giỏ hàng với ID: ${cartId}`);

      const cart = await Cart.findByIdAndDelete(cartId);
      if (!cart) {
        console.error(`Không tìm thấy giỏ hàng với ID ${cartId}`);
        throw new ApiError(404, "Cart Not Found");
      }
      res.status(StatusCodes.OK).json({
        message: "Xóa giỏ hàng thành công",
      });
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa giỏ hàng:", error);
      next(error);
    }
  }



  // PUT /carts/:userId/product/:productId
  async updateCartQuantity(req, res, next) {
    try {
      const { userId, productId } = req.params;
      const { action } = req.body;
      console.log(`Updating quantity for user: ${userId}, product: ${productId}, action: ${action}`);
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        console.error("Cart not found for user:", userId);
        throw new ApiError(404, "Cart Not Found");
      }

      const productInCart = cart.products.find(item => item.product.toString() === productId);
      if (!productInCart) {
        console.error("Product not found in cart:", productId);
        throw new ApiError(404, "Product Not Found in Cart");
      }

      if (action === 'increase') {
        productInCart.quantity += 1;
      } else if (action === 'decrease') {
        productInCart.quantity = Math.max(productInCart.quantity - 1, 1);
      }

      await cart.save();
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }



}

export default CartsController;
