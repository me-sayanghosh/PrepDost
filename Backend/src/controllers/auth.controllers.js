const usermodel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const nodemailer = require("nodemailer");
const blacklistmodel = require("../models/blacklist.model");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

function getMailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendResetPasswordCodeEmail(user, code) {
  const transporter = getMailTransporter();

  if (!transporter) {
    throw new Error("Mail service is not configured");
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "Your PrepDost password reset code",
    html: `
      <p>Hello ${user.username},</p>
      <p>We received a request to reset your password.</p>
      <p>Your verification code is:</p>
      <h2 style="letter-spacing: 4px;">${code}</h2>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });

}

/* 
@route POST /api/auth/register
@desc Register a new user
@access Public
*/
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const isuserexists = await usermodel.findOne({
      $or: [{ username }, { email: normalizedEmail }],
    });

    if (isuserexists) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newuser = new usermodel({
      username,
      email: normalizedEmail,
      password: hash,
    });

    await newuser.save();

    const token = jwt.sign(
      { id: newuser._id, username: newuser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newuser._id,
        username: newuser.username,
        email: newuser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* 
@route POST /api/auth/login
@desc login user with email and password
@access Public
*/
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const user = await usermodel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No user is available with this email",
        code: "USER_NOT_FOUND",
      });
    }

    const ispasswordvalid = await bcrypt.compare(password, user.password);

    if (!ispasswordvalid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* 
@route GET /api/auth/logout
@desc logout user by blacklisting the token
@access Public
*/
async function logoutUserController(req, res) {
  try {
    const token = req.cookies?.token;

    if (token) {
      // Add the token to the blacklist
      await blacklistmodel.create({ token });
    }

    res.clearCookie("token"); 

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* 
@route GET /api/auth/get-me
@desc Get the details of the logged in user
@access Private
*/
async function getMeController(req, res) {
  try {
    const user = await usermodel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User details fetched successfully",
         user :{
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* 
@route POST /api/auth/forgot-password
@desc Send a password reset verification code to the user's email
@access Public
*/
async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const user = await usermodel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No user is available with this email",
        code: "USER_NOT_FOUND",
      });
    }

    const resetCode = String(Math.floor(100000 + Math.random() * 900000));
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendResetPasswordCodeEmail(user, resetCode);

    return res.status(200).json({
      message: "Verification code sent to your registered email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error.message === "Mail service is not configured") {
      return res.status(500).json({ message: "Email service is not configured. Please contact support." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/* 
@route POST /api/auth/reset-password
@desc Reset a user's password using email and verification code
@access Public
*/
async function resetPasswordController(req, res) {
  try {
    const { email, code, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Email, code and password are required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const hashedToken = crypto.createHash("sha256").update(String(code)).digest("hex");

    const user = await usermodel.findOne({
      email: normalizedEmail,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Verification code is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
     registerUserController,
     loginUserController, 
     logoutUserController, 
     getMeController,
     forgotPasswordController,
     resetPasswordController
};
