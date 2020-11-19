import mongoose from "mongoose";
import { default as passportLocalMongoose } from "passport-local-mongoose";

const passportLocal = passportLocalMongoose;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocal);

let User = mongoose.model("User", userSchema);

export default User;
