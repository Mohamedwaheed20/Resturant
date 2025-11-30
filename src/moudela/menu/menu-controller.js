import { Router } from "express";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import * as menuService from "./service/menu-service.js";
import { authantication_middelware, authrization_middelware } from "../../middelware/authantication-middelware.js";
import { multermiddelwarehost } from "../../middelware/multer-midellware.js";

const router = Router();
const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

router.post(
  "/add",
  authantication_middelware(),
  authrization_middelware(["admin", "chef"]),
  multermiddelwarehost(allowedImageTypes).array("images", 5),
  errorHandler(menuService.addMenuService)
);

// عرض
router.get("/list", errorHandler(menuService.getMenuService));

// تحديث (ممكن يبعت ملفات جديدة)
router.put(
  "/update/:id",
  authantication_middelware(),
  authrization_middelware(["admin", "chef"]),
  multermiddelwarehost(allowedImageTypes).array("images", 5),
  errorHandler(menuService.updateMenuService)
);

// حذف
router.delete(
  "/delete/:id",
  authantication_middelware(),
  authrization_middelware(["admin", "chef"]),
  errorHandler(menuService.deleteMenuService)
);

export default router;

