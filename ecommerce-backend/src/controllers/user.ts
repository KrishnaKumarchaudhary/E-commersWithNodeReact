import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { NewUserRequestBody } from "../types/types";
import { TryCatch } from "../middlewares/error";

export const newUser = TryCatch(
  //This TryCatch is wripper to reduce code
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    //throw Error("Krishna some error");
    return next(Error("Krishna next error"));
    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });
    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);
