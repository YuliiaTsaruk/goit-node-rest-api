import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSingUpSchema, userSingInSchema } from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSingUpSchema),
  authControllers.register
);

authRouter.post(
  "/login",
  validateBody(userSingInSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
