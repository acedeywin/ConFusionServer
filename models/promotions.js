import mongoose from "mongoose";
import mongooseCurrency from "mongoose-currency";

mongooseCurrency.loadType(mongoose);

const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const promoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Promotions = mongoose.model("promotion", promoSchema);

export default Promotions;
