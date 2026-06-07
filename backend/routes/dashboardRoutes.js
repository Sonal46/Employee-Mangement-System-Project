import express from "express";
import { adminDashboard, employeeDashboard } from "../controllers/dashboardController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), adminDashboard);
router.get("/employee", protect, authorize("employee"), employeeDashboard);

export default router;
