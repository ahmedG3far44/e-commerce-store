import { ExtendedRequest } from "./../utils/types";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { GenerateTokenParams } from "../services/userService";

const verifyToken = async (
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
      res.status(403).send("Authorized token not valid");
    }
    req.user = validUser;
    next();
  } catch (err) {
    res.status(500).send("network connection error");
  }
};

export default verifyToken;
