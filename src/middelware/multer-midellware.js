import multer from "multer";
import fs from "fs";
import { ImageExtensions } from "../constant/constant.js";

export const multermiddelware = (destinationpath = "general", allowedtypes = ImageExtensions) => {
  try {
    const destnationfolder = `assets/${destinationpath}`;
    if (!fs.existsSync(destnationfolder)) {
      fs.mkdirSync(destnationfolder, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destnationfolder);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (allowedtypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false);
      }
    };

    const upload = multer({ fileFilter, storage });
    return upload;
  } catch (error) {
    console.log(error);
  }
};

export const multermiddelwarehost = (allowedtypes = ImageExtensions) => {
  try {
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (allowedtypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false);
      }
    };

    const upload = multer({ fileFilter, storage });
    return upload;
  } catch (error) {
    console.log(error);
  }
};
