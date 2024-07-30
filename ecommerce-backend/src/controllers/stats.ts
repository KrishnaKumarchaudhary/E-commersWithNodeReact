import { toDate } from "validator";
import { myCache } from "../app";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/products";
import { User } from "../models/user";
import { Order } from "../models/order";
import { calculatePercentage, getInventories } from "../utils/features";
import { stat } from "fs";
import { Promise } from "mongoose";
import { allOrders } from "./order";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};
  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };
    const thisMonthProducts = await Product.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthProducts = await Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthUsers = await User.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthUsers = await User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthOrders = await Order.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthOrders = await Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const lastSixMonthOrders = await Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });
    const latestTransections = await Order.find({}).select([
      "orderItems",
      "discount",
      "total",
      "status",
    ]);
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();
    const allOrders = await Order.find({}).select("total");
    const categories = await Product.distinct("category");
    const femaleUsersCount = await User.countDocuments({ gender: "female" });
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total: any, order: any) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total: any, order: any) => total + (order.total || 0),
      0
    );

    const ChangePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };
    const revenue = allOrders.reduce(
      (total: any, order: any) => total + (order.total || 0),
      0
    );
    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };
    const orderMonthsCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);
    lastSixMonthOrders.forEach((order: any) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();
      if (monthDiff < 6) orderMonthsCount[6 - monthDiff - 1] += 1;
      orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
    });

    const categoryCount: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };
    const modifiedLatestTransaction = latestTransections.map((i: any) => ({
      _id: i.id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));
    stats = {
      latestTransections,
      modifiedLatestTransaction,
      userRatio,
      categoryCount,
      ChangePercent,
      count,
      chart: {
        order: orderMonthsCount,
        revenue: orderMonthlyRevenue,
      },
    };
    myCache.set("admin-stats", JSON.stringify(stats));
  }
  return res.status(200).json({
    success: true,
    stats,
  });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  if (myCache.has("admin-pie-charts")) {
    charts = JSON.parse(myCache.get("admin-pie-charts") as string);
  } else {
    const processingOrder = await Order.countDocuments({
      status: "Processing",
    });
    const shippedOrder = await Order.countDocuments({ status: "Shipping" });
    const deliveredOrder = await Order.countDocuments({ status: "Delivered" });
    const categories = await Product.distinct("category");
    const productsCount = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const allOrders = await Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);
    const allUsers = await User.find({}).select(["dob"]);
    const adminUsers = await User.countDocuments({ role: "admin" });
    const customerUsers = await User.countDocuments({ role: "user" });
    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };
    const productCategories: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });
    const stockAvailablity = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };
    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };
    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };
    charts = {
      orderFullfillment,
      productCategories,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };
    myCache.set("admin-pie-charts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});
export const getBarCharts = TryCatch(async () => {});
export const getLineCharts = TryCatch(async () => {});
