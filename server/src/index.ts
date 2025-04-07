import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rootRoute from "./routes/rootRoute";
import mongoose from "mongoose";
// import http from "http"
// import https from "https"

// config env variables
dotenv.config();

const app = express();

const port = process.env.PORT as string;
const env = process.env.NODE_ENV as string;
const allowedOrigins = process.env.ALLOWED_ORIGINS as string;
// cors configs
app.use(
  cors({
    origin: [
      env === "development"
        ? allowedOrigins || "http:localhost:5173"
        : allowedOrigins,
    ],
    credentials: true,
  })
);

// db connection

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => {
    console.log("db connected success!");
  })
  .catch(() => {
    console.log("db connection failed!!");
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


