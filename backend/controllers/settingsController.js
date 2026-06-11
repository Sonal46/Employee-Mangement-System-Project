import User from "../models/User.js";
import Setting from "../models/Setting.js";
import { toPublicUrl } from "../utils/url.js";

const serializeSettings = (settings) => {
  if (!settings) {
    return settings;
  }

  const data = settings.toObject ? settings.toObject() : settings;

  return {
    ...data,
    logo: toPublicUrl(data.logo),
  };
};

const getSettingsDocument = async () => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
};

export const getSettings = async (req, res) => {
  const settings = await getSettingsDocument();
  res.json({ settings: serializeSettings(settings), admin: { id: req.user._id, name: req.user.name, email: req.user.email } });
};

export const updateAdminProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return res.status(404).json({ message: "Admin not found" });

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  await user.save();

  res.json({ id: user._id, name: user.name, email: user.email });
};

export const updateCompanySettings = async (req, res) => {
  const payload = {
    ...req.body,
    ...(req.file ? { logo: `/uploads/${req.file.filename}` } : {}),
  };
  const settings = await Setting.findOneAndUpdate({}, payload, { new: true, upsert: true, runValidators: true });
  res.json(serializeSettings(settings));
};
