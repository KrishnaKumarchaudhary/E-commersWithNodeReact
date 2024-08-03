import express from "express";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupons,
  newCoupon,
} from "../controllers/payment";
import { adminOnly } from "../middlewares/auth";
const app = express.Router();
// uri  => /api/v1/payment/create
app.post("/create", createPaymentIntent);
// uri  => /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
// uri  => /api/v1/payment/discount
app.get("/discount", applyDiscount);
// uri  => /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);
// uri  => /api/v1/payment/coupon/delete
app.route("/coupon/:id").delete(adminOnly, deleteCoupons);
export default app;
