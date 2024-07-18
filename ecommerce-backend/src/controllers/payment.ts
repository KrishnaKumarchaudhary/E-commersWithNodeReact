import { TryCatch } from "../middlewares/error";
import { Coupon } from "../models/coupon";
import ErrorHandler from "../utils/utility-class";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));
  await Coupon.create({ code: coupon, amount });
  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.body;
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) return next(new ErrorHandler("Invalid Coupone Code", 400));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});
export const allCoupons = TryCatch(async (req, res, next) => {
  const allCoupon = await Coupon.find({});
  if (!allCoupon)
    return next(new ErrorHandler("No Coupone Code avalible", 400));

  return res.status(200).json({
    success: true,
    allCoupon,
  });
});

export const deleteCoupons = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  await coupon.deleteOne();
  return res.status(200).json({
    success: true,
    massage: `Coupon ${coupon?.code} deleted successfully`,
  });
});
