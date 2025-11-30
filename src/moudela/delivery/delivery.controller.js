import express from "express";
import * as deliveryService from "./service/delivery-service.js"
import { authantication_middelware } from "../../middelware/authantication-middelware.js";      
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const deliveryController = express.Router();

deliveryController.patch("/add",authantication_middelware(), errorHandler(deliveryService.addDeliveryPersonService));

export default deliveryController;
