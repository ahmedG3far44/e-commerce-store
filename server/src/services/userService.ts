import { addNewProduct } from "./productService";
import user from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import orderModel from "../models/order";
import userModel from "../models/user";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await user.findOne({ email });

  if (findUser) {
    return { data: "user is already exist!!", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await user.insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const userPayload = {
    id: newUser.id,
    firstName,
    lastName,
    email,
    isAdmin: newUser.isAdmin,
  };
  const token = generateToken(userPayload);

  return {
    data: { user: { ...userPayload, addresses: newUser.addresses }, token },
    statusCode: 201,
  };
};

interface LoginParams {
  email: string;
  password: string;
}
export const login = async ({ email, password }: LoginParams) => {
  const findUser = await user.findOne({ email });

  if (!findUser) {
    return { data: "this user not found!!", statusCode: 400 };
  }

  const correctPasswords = await bcrypt.compare(password, findUser.password);

  if (!correctPasswords) {
    return { data: "your email or password is wrong!!", statusCode: 400 };
  }
  const { id, firstName, lastName, isAdmin, addresses } = findUser;

  const userPayload = {
    id,
    firstName,
    lastName,
    email,
    isAdmin,
  };

  const token = generateToken(userPayload);
  return {
    data: { user: { ...userPayload, addresses }, token },
    statusCode: 200,
  };
};

interface getUserOrdersParams {
  userId: string;
}
export const getUserOrders = async ({ userId }: getUserOrdersParams) => {
  try {
    const orders = await orderModel.find({ userId }).sort();
    return { data: { orders }, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

interface addUserAddressParams {
  userId: string;
  address: string;
}
export const addUserAddress = async ({
  userId,
  address,
}: addUserAddressParams) => {
  try {
    const user = await userModel.findById(userId);
    user?.addresses.push(address);
    await user?.save();
    console.log();
    if (!user?.addresses) {
      return { data: "addresses list not found", statusCode: 400 };
    }
    // userAddressesList?.push(address);
    return { data: user, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface GetUserAddressesListParams {
  userId: string;
}
export const getUserAddressesList = async ({
  userId,
}: GetUserAddressesListParams) => {
  try {
    const user = await userModel.findById(userId);
    const addresses = user?.addresses;

    return { data: addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

export interface GenerateTokenParams {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}
const generateToken = (payload: GenerateTokenParams) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
  return token;
};
