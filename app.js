import createError from "http-errors";
import express from "express";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import dishRouter from "./routes/dishRouter.js";
import promoRouter from "./routes/promoRouter.js";
import leaderRouter from "./routes/leaderRouter.js";

mongoose.set("useCreateIndex", true);

const url = "mongodb://localhost:27017/conFusion";
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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
