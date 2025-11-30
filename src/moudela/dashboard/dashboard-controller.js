import { Router } from "express";
import * as dashboardService from "./service/dashboard-service.js"; 
import { errorHandler } from "../../middelware/error-handler-middelware.js";
// import { authantication_middelware } from "../../middelware/authantication-middelware.js";

const dashboardController = Router();

dashboardController.get("/overview", errorHandler(dashboardService.dashboardOverview));

export default dashboardController;