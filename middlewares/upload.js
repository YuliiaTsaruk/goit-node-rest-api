import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const { _id } = req.user;
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${_id}_${uniquePrefix}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const upload = multer({
  storage,
  limits,
});

export default upload;
