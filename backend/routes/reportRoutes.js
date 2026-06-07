import express from "express";
import { getReports } from "../controllers/reportController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getReports);

export default router;
