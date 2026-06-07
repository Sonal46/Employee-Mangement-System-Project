import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const query = req.user.role === "admin" ? { $or: [{ userId: null }, { userId: req.user._id }] } : { userId: req.user._id };
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30);
  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json(notification);
};
