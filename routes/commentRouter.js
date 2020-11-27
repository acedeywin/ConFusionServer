import express from "express";
import bodyParser from "body-parser";

import * as corsDefault from "./cors.js";
import Comments from "../models/comments.js";
import { verifyUser, verifyAdmin } from "../authenticate.js";

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

//For the /:dishId/comments params
commentRouter
  .route("/")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Comments.find(req.query)
      .populate("author")
      .then(
        (comment) => {
          if (comment != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(comment);
          } else {
            err = new Error(`Dish ${req.params.dishId} not found.`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    if (req.body != null) {
      req.body.author = req.user._id;
      Comments.create(req.body)
        .then(
          (comment) => {
            Comments.findById(comment._id)
              .populate("author")
              .then((comment) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(comment);
              });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    } else {
      err = new Error("Commment not found in request body");
      err.status = 404;
      return next(err);
    }
  })
  .put(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation does not make sense on /comments`);
  })
  .delete(
    corsDefault.corsWithOptions,
    verifyUser,
    verifyAdmin,
    (req, res, next) => {
      Comments.remove({})
        .then(
          (res) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(res);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

// For the /:dishId/comments/:commentId params
commentRouter
  .route("/:commentId")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .populate("author")
      .then(
        (comment) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(comment);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /comments/`);
  })
  .put(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(
        (comment) => {
          if (comment != null) {
            //Allow a registered user to update his/her own comment
            if (comments.author.toString() != req.user._id.toString()) {
              let err = new Error(
                "You are not authorized to edit this comment"
              );
              err.status = 403;
              return next(err);
            }
            req.body.author = req.user._id;

            Comments.findByIdAndUpdate(
              req.params.commentId,
              {
                $set: req.body,
              },
              { new: true }
            ).then(
              (comment) => {
                Comments.findById(comment._id)
                  .populate("author")
                  .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(comment);
                  });
              },
              (err) => next(err)
            );
          } else {
            err = new Error(`Comment ${req.params.commentId} not found.`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(
        (comment) => {
          if (comment != null) {
            //Allow a registered user to delete his/her own comment
            if (comment.author.toString() != req.user._id.toString()) {
              let err = new Error(
                "You are not authorized to delete this comment"
              );
              err.status = 403;
              return next(err);
            }
            Comments.findByIdAndRemove(req.params.commentId)
              .then(
                (resp) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(resp);
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            let err = new Error(`Comment ${req.params.commentId} not found.`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

export default commentRouter;
