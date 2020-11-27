import express from "express";
import bodyParser from "body-parser";

import * as corsDefault from "./cors.js";
import Promotions from "../models/promotions.js";
import { verifyUser, verifyAdmin } from "../authenticate.js";

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Promotions.find(req.query)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Promotions.create(req.body)
        .then(
          (promo) => {
            console.log("Promotion created", promo);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`PUT operation does not make sense on /promotions`);
    }
  )
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

// For the promoId params
promoRouter
  .route("/:promoId")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /promotions/${req.params.promoId}`
      );
    }
  )
  .put(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndUpdate(
        req.params.promoId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promoId)
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

export default promoRouter;
