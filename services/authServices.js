import User from "../models/User.js";

export const singup = (data) => User.create(data);
