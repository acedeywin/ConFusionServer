import passport from "passport";
import passportStrategy from "passport-local";
import jsonStrategy from "passport-jwt";
import extract from "passport-jwt";
import jwt from "jsonwebtoken";
import FacebookStrategy from "passport-facebook-token";

import User from "./models/user.js";
import config from "./config.js";

const LocalStrategy = passportStrategy.Strategy;
const JwtStrategy = jsonStrategy.Strategy;
const ExtractJwt = extract.ExtractJwt;

export default passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 36000 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

export const jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

export const verifyUser = passport.authenticate("jwt", { session: false });

export const verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  } else {
    let err = new Error(`You are not authorized to perform this operation!`);
    err.status = 403;
    return next(err);
  }
};

export const facebookPassport = passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user !== null) {
          return done(null, user);
        } else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save(err, (user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);
