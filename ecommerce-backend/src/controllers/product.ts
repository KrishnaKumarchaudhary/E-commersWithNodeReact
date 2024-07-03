import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import {
  IBaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types";
import { Product } from "../models/products";
import ErrorHandler from "../utils/utility-class";
import { rm } from "fs";
import { myCache } from "../app";
//import { faker } from "@faker-js/faker";
import { invalidatesCache } from "../utils/features";

// Revalidate on new Update, Delete and new Order,
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products = [];
  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-product", JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    message: "product has created successfully",
  });
});
// Revalidate on new Update, Delete and new Order,
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    message: "All categories fetched successfully",
    categories,
  });
});
// Revalidate on new Update, Delete and new Order,
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("admin-products")) {
    products = JSON.parse(myCache.get("admin-products") as string);
  } else {
    products = await Product.find({});
    myCache.set("admin-products", JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    message: "All producted fetched for admin",
    products,
  });
});
// Revalidate on new Update, Delete and new Order,
export const getSingleProducts = TryCatch(async (req, res, next) => {
  let products;
  const id = req.params.id;
  if (myCache.has(`products-${id}`)) {
    products = JSON.parse(myCache.get(`products-${id}`) as string);
  } else {
    products = await Product.findById(id);
    myCache.set(`products-${id}`, JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    message: "product fetched by id",
    products,
  });
});
export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));
    if (!name || !category || !price || !stock) {
      rm(photo.path, () => console.log("deleted"));
      return next(new ErrorHandler("Please enter all field", 400));
    }
    await Product.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      photo: photo?.path,
    });
    await invalidatesCache({ products: true });
    return res.status(201).json({
      success: true,
      message: "product has created successfully",
    });
  }
);
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Invalid product Id", 404));
  if (photo) {
    rm(product.photo!, () => console.log(" old photo deleted"));
    product.photo = photo?.path;
  }
  if (name) product.name = name;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  await product.save();
  return res.status(200).json({
    success: true,
    message: "product has updated successfully",
  });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  rm(product.photo!, () => console.log("Product photo deleted"));
  await product.deleteOne();
  return res.status(201).json({
    success: true,
    message: "product has deleted",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery: IBaseQuery = {};
    if (search) {
      baseQuery.name = { $regex: search, $options: "i" }; // for search pattern and options for toLowerCase
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) {
      baseQuery.category = category;
    }
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);
    // const products = await Product.find(baseQuery)
    //   .sort(sort && { price: sort === "asc" ? 1 : -1 })
    //   .limit(limit)
    //   .skip(skip);
    //   const filteredOnlyProduct = await Product.find(baseQuery);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(201).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

//generateRandomProducts(40);
