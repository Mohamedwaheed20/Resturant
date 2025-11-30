import { globalErrorHandler } from "../middelware/error-handler-middelware.js";
import authController from "../moudela/Auth/auth-controller.js";
import menuController from "../moudela/menu/menu-controller.js";
import orderController from "../moudela/order/order-controller.js";
import categoryController from "../moudela/category/category-controller.js";
import deliveryController from "../moudela/delivery/delivery.controller.js";
import dashboardController from "../moudela/dashboard/dashboard-controller.js";

const routerHandler=(app)=>{

    app.use("/auth",authController)
    app.use("/menu",menuController)
    app.use("/order",orderController)
    app.use("/category",categoryController)
    app.use("/delivery",deliveryController)   // Fixed: added backtick
    app.use("/dashboard",dashboardController)     

    
    app.use(globalErrorHandler)
 }
 
 export default routerHandler;
 