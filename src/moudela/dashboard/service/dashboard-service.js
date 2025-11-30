import User from "../../../db/model/user-model.js";
import { Order } from "../../../db/model/order-moel.js";

// 🟦 Dashboard Main Stats
export const dashboardOverview = async (req, res) => {
  try {
    // 🧮 1) Count Users
    const totalUsers = await User.countDocuments();

    // 🧮 2) Count Orders
    const totalOrders = await Order.countDocuments();

    // 🧮 3) Total Revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // 🧮 4) Order status counts
    const orderStatusCount = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 🧮 5) Best selling menu items
    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.menuItem", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menus",
          localField: "_id",
          foreignField: "_id",
          as: "menuItem"
        }
      },
      { $unwind: "$menuItem" }
    ]);

    // 🧮 6) Today / Weekly / Monthly Revenue
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
      ])
    ]);

    // 🧮 7) Top Customers
    const topCustomers = await Order.aggregate([
      { $group: { _id: "$customerName", totalSpend: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { totalSpend: -1 } },
      { $limit: 5 }
    ]);

    // Return Dashboard Result
    res.status(200).json({
       totalUsers: totalUsers,
      totalOrders: totalOrders,
      totalRevenue: totalRevenue,
      orderStatusCount: orderStatusCount,
      bestSellers: bestSellers,
      todayRevenue: todayRevenue[0]?.revenue || 0,
      weekRevenue: weekRevenue[0]?.revenue || 0,
      monthRevenue: monthRevenue[0]?.revenue || 0,
      topCustomers
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
