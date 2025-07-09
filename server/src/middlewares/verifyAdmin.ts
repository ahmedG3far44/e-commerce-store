import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "./../utils/types";
import { GenerateTokenParams } from "../services/userService";

const verifyAdmin = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    if (!token) {
      res.status(403).send("Authorized token not valid");
    }
    const validUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as GenerateTokenParams;
    if (!validUser) {
      res.status(403).json("Authorized token not valid");
    }
    if (!validUser.isAdmin) {
      res
        .status(403)
        .json("Your not able to do this action, only admins can!!");
    }

    req.user = validUser;
    next();
  } catch (err) {
    res.status(500).json("network connection error or your token is not valid");
  }
};

export default verifyAdmin;
