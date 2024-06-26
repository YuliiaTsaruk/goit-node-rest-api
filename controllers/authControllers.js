import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

import {
  findUser,
  singup,
  updateUser,
  updateUserAvatar,
  updateUserSubscription,
  validatePassword,
} from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const newUser = await singup({ ...req.body, verificationToken }, avatarURL);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await updateUser({ _id: user.id }, { verify: true, verificationToken: null });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const comparePassword = await validatePassword(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: "" });
  res.status(204).json({ message: "No Content" });
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const result = await updateUserSubscription({ _id: id }, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file || !req.file.filename) {
    throw HttpError(400, "You must add a file to update the avatar");
  }

  const { filename } = req.file;

  const oldPath = path.resolve("tmp", filename);
  const newPath = path.resolve("public", "avatars", filename);
  const avatar = await Jimp.read(oldPath);
  if (!avatar) {
    throw HttpError(400, "Upload Error");
  }
  await avatar.resize(250, 250).write(oldPath);

  await fs.rename(oldPath, newPath);

  const posterPath = path.join("avatars", filename);

  const result = await updateUserAvatar(
    { _id },
    { avatarURL: posterPath },
    { new: true }
  );
  if (!result) {
    throw HttpError(401);
  }
  res.status(200).json({
    avatarURL: result.avatarURL,
  });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
