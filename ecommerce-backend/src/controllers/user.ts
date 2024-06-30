import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { NewUserRequestBody } from "../types/types";
import { TryCatch } from "../middlewares/error";
import ErrorHandler from "../utils/utility-class";

// Create New User API
export const newUser = TryCatch(
  //This TryCatch is wripper to reduce code
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    //throw Error("Krishna some error");
    //return next(Error("Krishna next error"));
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });
    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new ErrorHandler("Please add all filed", 400));
    user = await User.create({
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

// API for get all user
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});

// API for get user by id
export const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("Invalid ID", 400));
  return res.status(200).json({
    success: true,
    user,
  });
});

// API for get user by id
export const deleteUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("Invalid ID", 400));
  await user.deleteOne();
  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
