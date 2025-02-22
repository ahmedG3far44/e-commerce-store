import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rootRoute from "./routes/rootRoute";
import prisma from "./configs/db";

// config env variables
dotenv.config();

const app = express();

const port = process.env.PORT as string;
const env = process.env.NODE_ENV as string;
// cors configs
app.use(
  cors({
    origin: [process.env.ALLOWED_ORIGINS!],
  })
);

// db connection
prisma
  .$connect()
  .then(() => {
    console.log("db connected success!");
  })
  .catch(() => {
    console.log("db connect failed!!");
  });

// middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("app is running success");
});
app.use("/api", rootRoute);

// Listening Port
app.listen(port, () => {
  console.log(`server is running ${port}`);
});
