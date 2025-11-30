import { Order } from "../../../db/model/order-moel.js";
import { OrderStatus, DeliveryStatus } from "../../../constant/constant.js";
import { Notification } from "../../../db/model/notification-model.js";

/* -----------------------------------------
   🟩 1) Create New Order
----------------------------------------- */
export const createOrderService = async (req, res, next) => {
  try {
    const { customerName, phone, address, items, totalPrice } = req.body;

    // 🔵 Notification — Admin or system
    await Notification.create({
      title: "New Order",
      message: `Order created by ${customerName}`,
    });

    const orderObject = new Order({
      customerName,
      phone,
      address,
      items,
      totalPrice,
      status: OrderStatus[0],
    });

    const order = await orderObject.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 2) Get All Orders
----------------------------------------- */
export const getAllOrdersService = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("items.menuItem");
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 3) Update Order Status
----------------------------------------- */
export const updateOrderStatusService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔵 Notification
    await Notification.create({
      title: "Order Status Updated",
      message: `Order ${id} status changed to ${status}`,
    });

    res.status(200).json({ message: "Order updated", updatedOrder });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 4) Delete Order
----------------------------------------- */
export const deleteOrderService = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndDelete(id);

    // 🔵 Notification
    await Notification.create({
      title: "Order Deleted",
      message: `Order ${id} has been removed`,
    });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 5) Assign Delivery Person
----------------------------------------- */
export const assignDeliveryPerson = async (req, res, next) => {
  try {
    const { deliveryPerson } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPerson },
      { new: true }
    ).populate("deliveryPerson");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔵 Notification — to delivery person
    await Notification.create({
      user: deliveryPerson,
      title: "New Delivery Assigned",
      message: `You have been assigned to order ${order._id}`,
    });

    res.status(200).json({ message: "Delivery person assigned", order });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 6) Get Orders Assigned to Delivery Person
----------------------------------------- */
export const getMyOrders = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ deliveryPerson: id }).populate(
      "items.menuItem"
    );

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------
   🟩 7) Update Delivery Status
----------------------------------------- */
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!DeliveryStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid delivery status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔵 Notification
    await Notification.create({
      title: "Delivery Status Updated",
      message: `Order ${order._id} delivery status is now ${status}`,
    });

    res.status(200).json({
      message: "Delivery status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
};
