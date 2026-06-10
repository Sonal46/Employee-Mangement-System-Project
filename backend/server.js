import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";


dotenv.config();


const app = express();

const port = process.env.PORT || 5000;


// CORS FIX
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://employee-management-system-project.vercel.app",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    credentials: true,
  })
);


// Middleware
app.use(express.json());

app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static("uploads")
);


// Test API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});


// Routes

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/employees",
  employeeRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/payroll",
  payrollRoutes
);

app.use(
  "/api/leaves",
  leaveRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);


// Error Handler

app.use(
  (err, req, res, _next) => {

    console.error(err);

    const status =
      err.status || 500;


    res.status(status).json({
      message:
        err.message ||
        "Server error",
    });
  }
);


// Database + Server Start

connectDB()
  .then(() => {

    app.listen(
      port,
      () =>
        console.log(
          `API running on port ${port}`
        )
    );

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed",
      error.message
    );


    process.exit(1);

  });