import fs from "fs";
import cors from "cors";
import https from "https";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import rootRoute from "./routes/rootRoute";

dotenv.config();

const app = express();

const port = process.env.PORT as string;
const env = process.env.NODE_ENV as string;
// const allowedOrigins = process.env.ALLOWED_ORIGINS as string;


const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

app.use(cors(corsOptions));

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




app.get("/", (req, res) => {
  res.send("app is running success");
});
app.get("/health", (req, res) => {
  res.json({"status": "ok", "message": "server is running good!"});
});
app.use("/api", rootRoute);



if (env === "production") {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY as string),
    cert: fs.readFileSync(process.env.SSL_CERT as string),
  };

  https.createServer(options, app).listen(443, () => {
    console.log(`Https server is running on port 443 in ${env} environment`);
  });
} else {
  app.listen(port, () => {
    console.log(`Http server is running on port ${port} in ${env} environment`);
  });
}

