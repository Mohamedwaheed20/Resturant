import { Router } from "express";
import { addCategoryService } from "./service/category-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
import { multermiddelwarehost } from "../../middelware/multer-midellware.js";
import { ImageExtensions } from "../../constant/constant.js";

const categoryController = Router();

categoryController.post("/add",authantication_middelware(),multermiddelwarehost(ImageExtensions).single("image"), errorHandler(addCategoryService));

export default categoryController;