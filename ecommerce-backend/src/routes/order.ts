import express from "express";
import { adminOnly } from "../middlewares/auth";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  processOrder,
} from "../controllers/order";
const app = express.Router();
// uri  => /api/v1/order/new
app.post("/new", newOrder);
// uri  => /api/v1/order/myOrder
app.get("/myOrder", myOrder);
// uri  => /api/v1/order/all
app.get("/all", adminOnly, allOrders);
// uri  => /api/v1/order/all
app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);
export default app;
