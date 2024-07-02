import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user";
import { adminOnly } from "../middlewares/auth";
const app = express.Router();
// uri  => /api/v1/user/new
app.post("/new", newUser);
// uri  => /api/v1/user/all
app.get("/all",adminOnly, getAllUsers);
// uri => /api/v1/user/:id
// app.get("/:id", getUser);
// app.delete("/:id", deleteUser);
//above to can be chaining
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default app;
