import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";

import User from "./models/User.js";
import Employee from "./models/Employee.js";
import Attendance from "./models/Attendance.js";
import Payroll from "./models/Payroll.js";
import Leave from "./models/Leave.js";
import Notification from "./models/Notification.js";
import Activity from "./models/Activity.js";
import Setting from "./models/Setting.js";

import { calculatePayroll } from "./utils/payroll.js";


dotenv.config();


const seed = async () => {

  try {

    await connectDB();


    // CLEAR OLD DATA
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      Payroll.deleteMany({}),
      Leave.deleteMany({}),
      Notification.deleteMany({}),
      Activity.deleteMany({}),
      Setting.deleteMany({})
    ]);



    // ADMIN USER
    await User.create({

      name: "Sonal",

      email: "sonal@gmail.com",

      password: "Sonal@12345",

      role: "admin"

    });

    await Setting.create({ companyName: "PayrollPro", currency: "INR", workingDays: 26 });




    // EMPLOYEES DATA

    const employees = await Employee.insertMany([


      {
        name:"Rahul",
        email:"rahul@gmail.com",
        department:"Engineering",
        designation:"Frontend Developer",
        salary:78000,
        phone:"9876543210"
      },


      {
        name:"Sourav",
        email:"sourav@gmail.com",
        department:"Finance",
        designation:"Payroll Analyst",
        salary:72000,
        phone:"9876543211"
      },


      {
        name:"Asha",
        email:"asha@gmail.com",
        department:"Human Resources",
        designation:"HR Executive",
        salary:64000,
        phone:"9876543212"
      }


    ]);





    // CREATE EMPLOYEE LOGIN

    for(const employee of employees){


      await User.create({

        name: employee.name,

        email: employee.email,

        password:"Employee@123",

        role:"employee",

        employee:employee._id

      });





      const attendance = await Attendance.create({

        employee:employee._id,

        month:new Date().getMonth()+1,

        year:new Date().getFullYear(),

        workingDays:26,

        presentDays:23,

        leaves:2,

        absentDays:1

      });





      await Payroll.create({


        employee:employee._id,


        attendance:attendance._id,


        month:attendance.month,


        year:attendance.year,


        basicSalary:employee.salary,


        ...calculatePayroll({

          basicSalary:employee.salary,

          attendance

        })


      });

      await Leave.create({
        employeeId: employee._id,
        leaveType: "Casual Leave",
        startDate: new Date(),
        endDate: new Date(),
        reason: "Personal work",
        status: "Pending"
      });



    }

    await Notification.create({
      title: "Payroll generated",
      message: "Payroll generated for current month"
    });

    await Activity.create({
      action: "Payroll generated for current month"
    });




    const totalUsers = await User.countDocuments();


    console.log("Seed complete ✅");

    console.log("Users created:", totalUsers);


    console.log(
      "Admin login: sonal@gmail.com / Sonal@12345"
    );


    console.log(
      "Employee login: sourav@gmail.com / Employee@123"
    );



    await mongoose.connection.close();


    process.exit();



  } catch(error){

    console.log("Seed error ❌",error);

    process.exit(1);

  }

};


seed();
