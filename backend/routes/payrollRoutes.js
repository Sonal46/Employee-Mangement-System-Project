import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { generatePayroll, getMyPayrolls, getPayrolls, getPayslip, markPaid } from "../controllers/payrollController.js";

const router = express.Router();

router.get("/my", protect, authorize("employee"), getMyPayrolls);
router.get("/payslip/:id", protect, getPayslip);
router.get("/", protect, authorize("admin"), getPayrolls);
router.post("/generate", protect, authorize("admin"), generatePayroll);
router.put("/:id/pay", protect, authorize("admin"), markPaid);

export default router;
