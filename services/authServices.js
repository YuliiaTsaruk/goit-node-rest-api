import bcrypt from "bcrypt";

import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const singup = async (data, avatarURL) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword, avatarURL });
};

export const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateUserSubscription = (filter, data) =>
  User.findOneAndUpdate(filter, data, { new: true });

export const updateUserAvatar = async (filter, data) =>
  User.findOneAndUpdate(filter, data, { new: true });
