import express from "express";
import bodyParser from "body-parser";

import * as corsDefault from "./cors.js";
import Favorites from "../models/favorites.js";
import { verifyUser } from "../authenticate.js";

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter
  .route("/")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          if (favorites) {
            let userFavorites = favorites.filter(
              (favorite) =>
                favorite.user._id.toString() === req.user.id.toString()
            )[0];
            if (!userFavorites) {
              let err = new Error(
                "You have no favorites. Please, try adding favorites first."
              );
              err.status = 404;
              return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavorites);
          } else {
            let err = new Error("There are no favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then((favorites) => {
        let user;
        if (favorites)
          user = favorites.filter(
            (favorite) =>
              favorite.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favorites({ user: req.user.id });
        for (let i of req.body) {
          if (
            user.dishes.find((id) => {
              if (id._id) {
                return id._id.toString() === i._id.toString();
              }
            })
          )
            continue;
          user.dishes.push(i._id);
        }
        user
          .save()
          .then(
            (favorite) => {
              Favorites.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                });
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favorites");
  })
  .delete(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          let removeFavorites;
          if (favorites) {
            removeFavorites = favorites.filter(
              (favorite) =>
                favorite.user._id.toString() === req.user.id.toString()
            )[0];
          }
          if (removeFavorites) {
            removeFavorites.remove().then(
              (favorite) => {
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              },
              (err) => next(err)
            );
          } else {
            let err = new Error("You do not have any favorites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoritesRouter
  .route("/:dishId")
  .options(corsDefault.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(corsDefault.mainCors, verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorites) => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then((favorites) => {
        var user;
        if (favorites)
          user = favorites.filter(
            (favorite) =>
              favorite.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favorites({ user: req.user.id });
        if (
          !user.dishes.find((id) => {
            if (id._id)
              return id._id.toString() === req.params.dishId.toString();
          })
        )
          user.dishes.push(req.params.dishId);

        user
          .save()
          .then(
            (favorite) => {
              Favorites.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                });
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .delete(corsDefault.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favorites) => {
          let user;
          if (favorites)
            user = favorites.filter(
              (favorite) =>
                favorite.user._id.toString() === req.user.id.toString()
            )[0];
          if (user) {
            user.dishes = user.dishes.filter(
              (dishid) => dishid._id.toString() !== req.params.dishId
            );
            user.save().then(
              (favorite) => {
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                  });
              },
              (err) => next(err)
            );
          } else {
            let err = new Error("You do not have any favourites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

export default favoritesRouter;
