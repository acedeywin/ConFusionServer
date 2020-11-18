import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

//let Dishes = mongoose.model("Dish", dishSchema);

export default mongoose.model("User", User);
