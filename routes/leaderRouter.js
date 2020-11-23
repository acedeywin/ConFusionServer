import express from "express";
import bodyParser from "body-parser";

import * as corsDefault from "./cors.js";
import Leaders from "../models/leaders.js";
import { verifyUser, verifyAdmin } from "../authenticate.js";

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Leaders.find({})
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
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
      Leaders.create(req.body)
        .then(
          (leader) => {
            console.log("leader created", leader);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
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
      res.end(`PUT operation does not make sense on /leaders`);
    }
  )
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Leaders.remove({})
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

// For the leaderId params
leaderRouter
  .route("/:leaderId")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
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
        `POST corsDefault.corsWithOptions, operation not supported on /leaders/${req.params.leaderId}`
      );
    }
  )
  .put(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
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
      Leaders.findByIdAndRemove(req.params.leaderId)
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

export default leaderRouter;
