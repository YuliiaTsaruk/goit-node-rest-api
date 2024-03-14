import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSingUpSchema, userSingInSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSingUpSchema),
  authControllers.register
);

export default authRouter;
