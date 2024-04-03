import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userSingUpSchema,
  userSingInSchema,
  updateSubscriptionSchema,
  userEmailSchema,
} from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import upload from "../middlewares/upload.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSingUpSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(userEmailSchema),
  authControllers.resendVerify
);

authRouter.post(
  "/login",
  validateBody(userSingInSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/:id/subscription",
  authenticate,
  isValidId,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

export default authRouter;
