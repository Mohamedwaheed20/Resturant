// src/models/category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    type: Object, // { secure_url, public_id }
  },
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);
