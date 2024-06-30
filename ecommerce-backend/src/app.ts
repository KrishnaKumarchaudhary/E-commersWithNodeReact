import express, { NextFunction, Response, Request } from "express";

//importing routes
import userRoutes from "./routes/user";
import { connectDB } from "./utils/features";
import { errorMiddleware } from "./middlewares/error";
const app = express();
const port = 4000;
connectDB();
app.use(express.json()); // this is middleware to convert req.body data into json formate
//Using Routes
app.use("/api/v1/user", userRoutes);
app.get("/products", (req, res) => {
  res.send("asdfds");
});
app.get("/", (req, res) => {
  res.send("API is wprking bro!");
});
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
