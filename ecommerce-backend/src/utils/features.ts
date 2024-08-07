import mongoose from "mongoose";
import { InvalidatesCacheProps, OrderItemType } from "../types/types";
import { myCache } from "../app";
import { Product } from "../models/products";
import { Order } from "../models/order";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "Ecommerce24" })
    .then((c) => console.log(`DB connect to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidatesCache = ({
  products,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidatesCacheProps) => {
  if (products) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "admin-products",
    ];
    if (typeof productId === "string")
      productKeys.push(`products-${productId}`);
    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`products-${i}`));
    // console.log(productKeys, productId);
    myCache.del(productKeys);
  }

  if (order) {
    console.log(orderId);
    const ordersKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(ordersKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let index = 0; index < orderItems.length; index++) {
    const order = orderItems[index];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = ((thisMonth / lastMonth) * 100).toFixed(0);
  return Number(percent);
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};
interface myDocument extends Document {
  createAt: Date;
  discount: number;
  total: number;
}
type fincProps = {
  length: number;
  docArr: myDocument[];
  today: Date;
  property?: "discount" | "total";
};
export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: fincProps) => {
  const data: number[] = new Array(length).fill(0);
  docArr.forEach((i: any) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }
  });
  return data;
};
