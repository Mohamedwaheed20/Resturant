import { Router } from "express";
import * as orderService from "./service/order-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
const orderController= Router()
orderController.post("/add",authantication_middelware(),errorHandler(orderService.createOrderService))
orderController.get("/list",errorHandler(orderService.getAllOrdersService))
orderController.put("/update/:id",authantication_middelware(),errorHandler(orderService.updateOrderStatusService))
orderController.delete("/delete/:id",authantication_middelware(),errorHandler(orderService.deleteOrderService))
orderController.put("/assign/:id",authantication_middelware(),errorHandler(orderService.assignDeliveryPerson))
orderController.get("/my-orders/:id",authantication_middelware(),errorHandler(orderService.getMyOrders))
orderController.put("/update-delivery-status/:id",authantication_middelware(),errorHandler(orderService.updateDeliveryStatus))



export default orderController;

