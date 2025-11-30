import User from "../../../db/model/user-model.js";

export const addDeliveryPersonService = async (req, res, next) => {
  try {
    const userId = req.authuser._id; // جاي من التوكن بعد تسجيل الدخول

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "delivery" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User is now a delivery person",
      user,
    });
  } catch (error) {
    next(error);
  }
};
