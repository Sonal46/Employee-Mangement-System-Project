import express from "express";
import { deleteAttendance, getAttendance, upsertAttendance } from "../controllers/attendanceController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.route("/").get(getAttendance).post(upsertAttendance);
router.delete("/:id", deleteAttendance);

export default router;
