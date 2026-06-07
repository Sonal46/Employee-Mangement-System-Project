import express from "express";
import { getSettings, updateAdminProfile, updateCompanySettings } from "../controllers/settingsController.js";
import { authorize, protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/", getSettings);
router.put("/admin-profile", updateAdminProfile);
router.put("/company", uploadImage.single("logo"), updateCompanySettings);

export default router;
