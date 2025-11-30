import mongoose from "mongoose";
import { OrderStatus,DeliveryStatus } from "../../constant/constant.js";
import { Menu } from "./menu-model.js";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus[0],
    },
    deliveryPerson: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // المندوب
},
deliveryStatus: {
  type: String,
  enum: DeliveryStatus,
  default: DeliveryStatus[0],
},
deliveryLocation: {
  type: String,
},

  },
  { timestamps: true }
);
orderSchema.pre("save", async function (next) {
  try {
    let total = 0;

    // لكل صنف في الطلب
    for (const item of this.items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (menuItem) {
        total += menuItem.price * item.quantity;
      }
    }

    this.totalPrice = total;
    next();
  } catch (error) {
    next(error);
  }
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
