import express from "express";

//importing routes
import userRoutes from "./routes/user";
const app = express();
const port = 4000;

//Using Routes
app.use("/api/v1/user", userRoutes);
app.get("/products", (req, res) => {
  res.send("asdfds");
});
app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
