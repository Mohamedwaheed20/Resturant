import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const menuSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: {
      urls: [imageSchema],
      folder: String,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
