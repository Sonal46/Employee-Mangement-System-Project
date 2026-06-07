import express from "express";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getLeaves);
router.post("/", protect, authorize("employee", "admin"), applyLeave);
router.put("/:id/status", protect, authorize("admin"), updateLeaveStatus);

export default router;
