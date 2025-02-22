import { Router } from "express";
import { login, register } from "../services/userService";


const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});




export default router;
