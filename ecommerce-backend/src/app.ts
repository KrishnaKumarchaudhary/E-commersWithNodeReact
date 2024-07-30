import express, { NextFunction, Response, Request } from "express";
import { connectDB } from "./utils/features";
import { errorMiddleware } from "./middlewares/error";
import NodeCache from "node-cache";
import { config } from "dotenv";
//importing routes
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
import orderRoute from "./routes/order";
import paymentRoute from "./routes/payment";
import dashboardRoute from "./routes/stats";
import morgan from "morgan";

config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);
// for cache creating instance
export const myCache = new NodeCache();
app.use(express.json()); // this is middleware to convert req.body data into json formate
app.use(morgan("dev")); // to show response in terminal

//Using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.get("/products", (req, res) => {
  res.send("asdfds");
});
app.get("/", (req, res) => {
  res.send("API is wprking bro!");
});
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});

//4:06:15  03-07-2024
//4:52:39  09-07-2024
//4:55:42  10-07-2024
//5:57:00  28-07-2024
//6:23:24  28-07-2024
//6:55:26  30-07-2024
