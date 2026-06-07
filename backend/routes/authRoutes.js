import express from "express";

import {
  login,
  me,
  register,
  forgotPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";


const router = express.Router();


// LOGIN
router.post("/login", login);


// CREATE ACCOUNT
router.post("/register", register);


// RESET PASSWORD
router.post("/forgot-password", forgotPassword);


// CURRENT USER
router.get("/me", protect, me);


export default router;