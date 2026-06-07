import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";

export const recordActivity = async (action, performedBy) => {
  if (!action) return null;
  return Activity.create({ action, performedBy });
};

export const notify = async ({ title, message, userId }) => {
  if (!title || !message) return null;
  return Notification.create({ title, message, userId });
};
