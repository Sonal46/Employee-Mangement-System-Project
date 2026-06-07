import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  getMyProfile,
  updateEmployee,
  updateMyProfile,
} from "../controllers/employeeController.js";
import { authorize, protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

router.get("/me/profile", protect, authorize("employee"), getMyProfile);
router.put("/me/profile", protect, authorize("employee"), uploadImage.single("profileImage"), updateMyProfile);

router.use(protect, authorize("admin"));
router.route("/").get(getEmployees).post(uploadImage.single("profileImage"), createEmployee);
router.route("/:id").get(getEmployee).put(uploadImage.single("profileImage"), updateEmployee).delete(deleteEmployee);

export default router;
