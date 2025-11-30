import { Router } from "express";
import * as authService from "./service/auth-service.js"; 
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";

const authController = Router();

authController.post("/signup", errorHandler(authService.signupService));

authController.post("/signin", errorHandler(authService.signinService));

authController.post("/verifyotp",authantication_middelware(), errorHandler(authService.verifyotpService));

authController.post("/signout",authantication_middelware(), errorHandler(authService.signoutService));


authController.post("/forgetpassword",authantication_middelware(), errorHandler(authService.forgetpasswordService));

authController.post("/resetpassword",authantication_middelware(), errorHandler(authService.resetpasswordService));

authController.get("/notifications/:id",authantication_middelware(), errorHandler(authService.getUserNotificationsByUserId));
authController.put("/notifications/:id/read",authantication_middelware(), errorHandler(authService.markAsRead));

export default authController;
