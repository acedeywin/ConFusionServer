import mongoose from "mongoose";
import { dishSchema } from "./dishes.js";
//import { userSchema } from "./user.js";

const Schema = mongoose.Schema;

const favoritesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
      },
    ],
  },

  {
    timestamps: true,
  }
);

let Favorites = mongoose.model("Favorite", favoritesSchema);

export default Favorites;
