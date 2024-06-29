import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", { dbName: "Ecommerce24" })
    .then((c) => console.log(`DB connect to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
