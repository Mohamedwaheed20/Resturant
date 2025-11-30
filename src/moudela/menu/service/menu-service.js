import { nanoid } from "nanoid";
import { Menu } from "../../../db/model/menu-model.js";
import fs from "fs/promises";
import { cloudinaryConfig } from "../../../config/cloudnairy-config.js";


export const addMenuService = async (req, res, next) => {
  try {
    const { _id: owner_id } = req.authuser;
    const { name, description, price, category } = req.body;

    const menuObject = new Menu({
      owner_id,
      name,
      description,
      price,
      category,
    });

  if (req.files?.length) {
      const folder = nanoid(6);
      const images = { urls: [], folder };

      for (const file of req.files) {
        const result = await cloudinaryConfig().uploader.upload(file.path, {
          folder: `${process.env.CLOUDINARY_FOLDER}/${folder}`,
        });
        images.urls.push({ secure_url: result.secure_url, public_id: result.public_id });

        await fs.unlink(file.path).catch(() => {});
      }
      menuObject.images = images;
    }

    const menu = await Menu.create(menuObject);
    res.status(201).json({ message: "Menu item added successfully", menu });
  } catch (error) {
    next(error);
  }
};

export const getMenuService = async (req, res, next) => {
  try {
    const items = await Menu.find().populate("owner_id", "username email");
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const updateMenuService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu item not found" });

    // لو فيه ملفات جديدة: ارفعها واحذف القديمة من Cloudinary
    if (req.files?.length) {
      // حذف الصور القديمة من cloud (لو موجودة)
      if (menu.images?.urls?.length) {
        for (const img of menu.images.urls) {
          try {
            await cloudinaryConfig().uploader.destroy(img.public_id);
          } catch (err) {
            console.warn("Cloudinary destroy warning:", err.message);
          }
        }
      }

      const folder = nanoid(6);
      const images = { urls: [], folder };

      for (const file of req.files) {
        const result = await cloudinaryConfig().uploader.upload(file.path, {
          folder: `${process.env.CLOUDINARY_FOLDER}/menu/${folder}`,
        });
        images.urls.push({ secure_url: result.secure_url, public_id: result.public_id });
        await fs.unlink(file.path).catch(() => {});
      }
      updateData.images = images;
    }

    const updated = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Item updated", updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu item not found" });

    // حذف الصور من cloud
    if (menu.images?.urls?.length) {
      for (const img of menu.images.urls) {
        try {
          await cloud.uploader.destroy(img.public_id);
        } catch (err) {
          console.warn("Cloudinary destroy warning:", err.message);
        }
      }
    }

    await Menu.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};
