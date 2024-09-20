import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    rating: {
      count: {
        type: Number,
      },
      rate: {
        type: Number,
      },
    },
    discountPercentage: {
      type: Number,
      default: 0, 
    },
    saleStartDateTime:{
      type: String,
    },
    saleEndDateTime: {
      type: String, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
