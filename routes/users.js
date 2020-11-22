import express from "express";
import bodyParser from "body-parser";
import passport from "passport";

import * as corsDefault from "./cors.js";
import User from "../models/user.js";
import { getToken, verifyUser, verifyAdmin } from "../authenticate.js";

const usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* GET users listing. */
usersRouter.get(
  "/",
  corsDefault.corsWithOptions,
  verifyUser,
  verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

usersRouter.post("/signup", corsDefault.corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.save(err, (user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful" });
          });
        });
      }
    }
  );
});

usersRouter.post(
  "/login",
  corsDefault.corsWithOptions,
  passport.authenticate("local"),
  (req, res) => {
    let token = getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token,
      status: "You are successfully logged in.",
    });
  }
);

usersRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    let err = new Error("You are not log in");
    err.status = 403;
    next(err);
  }
});

usersRouter.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      let token = getToken({ _id: req.user._id });
      res.sendStatus = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token,
        status: "You are successfully logged in!",
      });
    }
  }
);

export default usersRouter;
