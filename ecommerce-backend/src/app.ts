import express, { NextFunction, Response, Request } from "express";
import { connectDB } from "./utils/features";
import { errorMiddleware } from "./middlewares/error";
import NodeCache from "node-cache";
//importing routes
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
const app = express();
const port = 4000;
connectDB();
// for cache creating instance
export const myCache = new NodeCache();
app.use(express.json()); // this is middleware to convert req.body data into json formate
//Using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

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
