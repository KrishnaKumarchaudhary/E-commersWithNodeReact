import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  getSingleProducts,
  newProduct,
  updateProduct,
} from "../controllers/product";
import { singleUpload } from "../middlewares/multer";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();
//Create New Product  - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
// get all product with filter
app.get("/all", getAllProducts);
//to get latest 10 products  - /api/v1/product/latest
app.get("/latest", getLatestProducts);
//To get all unique Categories  -/api/v1/product/admin-products
app.get("/categories", getAllCategories);
//to get all products  - /api/v1/product/admin-products;
app.get("/admin-products", adminOnly, getAdminProducts);
// get product by id, update and delete.
app
  .route("/:id")
  .get(getSingleProducts)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);
export default app;
