import mongoose from "mongoose";
import { InvalidatesCacheProps } from "../types/types";
import { myCache } from "../app";
import { Product } from "../models/products";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", { dbName: "Ecommerce24" })
    .then((c) => console.log(`DB connect to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidatesCache = async ({
  products,
  order,
  admin,
}: InvalidatesCacheProps) => {
  if (products) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "admin-products",
    ];
    const products = await Product.find({}).select("_id");
    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });
    myCache.del(productKeys);
  }
  if (products) {
  }
  if (products) {
  }
};
