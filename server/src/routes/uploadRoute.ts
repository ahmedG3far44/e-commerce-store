import express, { Request, Response } from "express";
import upload from "../configs/multer"; // Adjust the path to your Multer middleware
import { ExtendedRequest } from "../utils/types";

const router = express.Router();

// Extend the Request interface to include the `files` property
interface Req extends Request {
  files?:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;
}

router.post("/", upload.any(), async (req: Req, res) => {
  try {
    // const files = req.files;

    // for (const i of files) {
    //   console.log(i);
    // }

    res.status(200).json({ message: "Files uploaded successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
