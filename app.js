import createError from "http-errors";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
//import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import session from "express-session";
import { default as SessionFileStore } from "session-file-store";
import passport from "./authenticate.js";
import config from "./config.js";

//const FileStore = SessionFileStore(session);

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import dishRouter from "./routes/dishRouter.js";
import promoRouter from "./routes/promoRouter.js";
import leaderRouter from "./routes/leaderRouter.js";

mongoose.set("useCreateIndex", true);

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

connect.then(
  () => {
    console.log(`Connected correctly to the server.`);
  },
  (err) => {
    console.log(err);
  }
);

const app = express(),
  __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      `https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("12345-56789-91234-45678"));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(__dirname + "/public"));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
