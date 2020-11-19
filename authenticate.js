import passport from "passport";
import strategy from "passport-local";

import User from "./models/user.js";

const LocalStrategy = strategy.Strategy;

export default passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
