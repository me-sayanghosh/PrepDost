const usermodel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistmodel = require("../models/blacklist.model");

/* 
@route POST /api/auth/register
@desc Register a new user
@access Public
*/
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isuserexists = await usermodel.findOne({
      $or: [{ username }, { email }],
    });

    if (isuserexists) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newuser = new usermodel({
      username,
      email,
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
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
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

module.exports = {
     registerUserController,
     loginUserController, 
     logoutUserController, 
     getMeController 
};
