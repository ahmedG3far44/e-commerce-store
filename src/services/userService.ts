import prisma from "../configs/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUserRegister {
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
}: IUserRegister) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (findUser) {
    return { data: "user is already exist!!", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  console.log("a new user was created");
  console.log(newUser);
  //   const { id, firstName, lastName, email } = newUser;

  const token = generateToken({ id: newUser.id, firstName, lastName, email });

  return { data: { ...newUser, token }, statusCode: 201 };
};

interface IUserLogin {
  email: string;
  password: string;
}
export const login = async ({ email, password }: IUserLogin) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findUser) {
    return { data: "this user not found!!", statusCode: 400 };
  }

  const correctPasswords = await bcrypt.compare(password, findUser.password);

  if (!correctPasswords) {
    return { data: "wrong password or email", statusCode: 400 };
  }
  const { id, firstName, lastName } = findUser;

  const token = generateToken({
    id,
    firstName,
    lastName,
    email: findUser.email,
  });
  return { data: { ...findUser, token }, statusCode: 200 };
};

export interface ITokenPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
const generateToken = (payload: ITokenPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
  return token;
};
