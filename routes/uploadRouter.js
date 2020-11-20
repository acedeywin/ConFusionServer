import express from "express";
import bodyParser from "body-parser";
import { verifyUser, verifyAdmin } from "../authenticate.js";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files."), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter
  .route("/")
  .get(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Get operation does not make sense on /imageUpload`);
  })
  .post(verifyUser, verifyAdmin, upload.single("imageFile"), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
  })
  .put(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation does not make sense on /imageUpload`);
  })
  .delete(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`DELETE operation does not make sense on /imageUpload`);
  });

export default uploadRouter;
