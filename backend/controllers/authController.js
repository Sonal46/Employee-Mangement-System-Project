import jwt from "jsonwebtoken";
import User from "../models/User.js";
const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    employee: user.employee,
  };
};
export const register = async(req,res)=>{
try{
const {name,email,password,role}=req.body;
if(!name || !email || !password){
return res.status(400).json({
message:"All fields required"
});
}
const exists = await User.findOne({
email: email.trim().toLowerCase()
});

if(exists){
return res.status(400).json({
message:"Email already exists"
});
}

const user = await User.create({
name,
email: email.trim().toLowerCase(),
password: password.trim(),
role: role || "employee"
});
return res.status(201).json({
message:"Account created successfully",
user:sanitizeUser(user)
});
}catch(error){
console.log(error);
return res.status(500).json({
message:"Server error"
});
}
};

export const login = async(req,res)=>{
try{
const {email,password}=req.body;
if(!email || !password){
return res.status(400).json({
message:"Email and password required"
});
}

const normalizedEmail = email.trim().toLowerCase();
const legacyPayrollEmail = normalizedEmail.endsWith("@gmail.com")
? normalizedEmail.replace("@gmail.com", "@payroll")
: "";

const user = await User.findOne({
email: legacyPayrollEmail ? { $in: [normalizedEmail, legacyPayrollEmail] } : normalizedEmail
})
.select("+password")
.populate("employee");

if(!user){
return res.status(401).json({
message:"Invalid credentials"
});
}

const match = await user.comparePassword(
password
);
if(!match){
return res.status(401).json({
message:"Invalid credentials"
});
}

if(user.email !== normalizedEmail && legacyPayrollEmail && user.email === legacyPayrollEmail){
user.email = normalizedEmail;
await user.save();
}

return res.json({
token:signToken(user),
user:sanitizeUser(user)
});
}catch(error){
console.log(error);
return res.status(500).json({
message:"Server error"
});
}

};
export const forgotPassword = async(req,res)=>{
try{
const {email,newPassword}=req.body;
if(!email || !newPassword){
return res.status(400).json({
message:"Email and new password required"
});
}

const user = await User.findOne({
email: email.trim().toLowerCase()
});
if(!user){
return res.status(404).json({
message:"User not found"
});
}
user.password = newPassword.trim();
await user.save();
return res.json({
message:"Password changed successfully"
});
}catch(error){
console.log(error);
return res.status(500).json({
message:"Server error"
});
}
};

export const me = async(req,res)=>{
return res.json({
user:sanitizeUser(req.user)
});
};
