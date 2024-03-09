import { isValidObjectId } from "mongoose";

import HttpError from "../helpers/HttpError.js";

const isValideId = (req, _, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`));
  }
  next();
};

export default isValideId;
