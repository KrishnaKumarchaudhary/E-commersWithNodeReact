import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photo:{
      type: String,
    },
    // photo: {
    //   public_id: {
    //     type: String,
    //     required: [true, "Please enter public ID"],
    //   },
    //   url: {
    //     type: String,
    //     required: [true, "Please enter URL"],
    //   },
    // },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Description"],
      trim: true,
    },
    // ratings: {
    //   type: Number,
    //   default: 0,
    // },
    // numOfReviews: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", schema);
