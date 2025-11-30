import { nanoid } from "nanoid";
import { cloudinaryConfig } from "../../../config/cloudnairy-config.js";
import { Category } from "../../../db/model/categorey-model.js";

export const addCategoryService = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const categoryObject = { name, description };

    // Upload image if exists
    if (req.file) {
      const folder = `restaurant/category/${nanoid(4)}`;
      const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder,
      });
      categoryObject.image = { secure_url, public_id };
    }

    const category = await Category.create(categoryObject);

    res.status(200).json({ message: "Category added successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
