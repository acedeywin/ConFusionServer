import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import * as corsDefault from "./cors.js";
import { verifyUser, verifyAdmin } from "../authenticate.js";

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
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Get operation does not make sense on /imageUpload`);
  })
  .post(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`PUT operation does not make sense on /imageUpload`);
    }
  )
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`DELETE operation does not make sense on /imageUpload`);
    }
  );

export default uploadRouter;
