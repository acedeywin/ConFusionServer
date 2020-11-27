import express from "express";
import bodyParser from "body-parser";

import * as corsDefault from "./cors.js";
import Dishes from "../models/dishes.js";
import { verifyUser, verifyAdmin } from "../authenticate.js";

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, verifyUser, (req, res, next) => {
    Dishes.find(req.query)
      .populate("comments.author")
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
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
      Dishes.create(req.body)
        .then(
          (dish) => {
            console.log("Dish Created", dish);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
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
      res.end(`PUT operation does not make sense on /dishes`);
    }
  )
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Dishes.remove({})
        .then(
          (dishes) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dishes);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

// For the dishId params
dishRouter
  .route("/:dishId")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
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
      res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
    }
  )
  .put(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Dishes.findByIdAndUpdate(
        req.params.dishId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
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
      Dishes.findByIdAndRemove(req.params.dishId)
        .then(
          (dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

export default dishRouter;
