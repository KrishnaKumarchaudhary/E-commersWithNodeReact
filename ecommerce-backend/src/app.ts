import express, { NextFunction, Response, Request } from "express";
import { connectDB } from "./utils/features";
import { errorMiddleware } from "./middlewares/error";
import NodeCache from "node-cache";
import { config } from "dotenv";
//importing routes
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
import orderRoute from "./routes/order";
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

//2:16:15
