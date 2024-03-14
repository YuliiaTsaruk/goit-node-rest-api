import { singup } from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const register = async (req, res) => {
  const newUser = await singup(req.body);

  res.status(201).json({
    email: newUser.email,
  });
};

export default {
  register: ctrlWrapper(register),
};
