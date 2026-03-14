const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


// ============================
// REGISTER USER
// ============================
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    // INPUT VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      verificationToken
    });

    await user.save();

    // verification link
    const verifyURL = `http://localhost:5173/verify/${verificationToken}`;

    // Always log for dev — works even if email fails
    console.log(`\n[EMAIL VERIFICATION LINK] ${verifyURL}\n`);

    await sendEmail(
      email,
      "Verify Your Email",
      `Click the link to verify your account:\n${verifyURL}`
    );

    res.status(201).json({
      message: "User registered successfully. Please verify your email."
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};



// ============================
// EMAIL VERIFICATION
// ============================
exports.verifyEmail = async (req, res) => {

  try {

    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};



// ============================
// LOGIN USER
// ============================
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // INPUT VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};



// ============================
// FORGOT PASSWORD
// ============================
exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink =
      `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    // Always log for dev — works even if email fails
    console.log(`\n[PASSWORD RESET LINK] ${resetLink}\n`);

    await sendEmail(
      user.email,
      "Password Reset",
      `Reset your password using the link below:\n${resetLink}`
    );

    res.json({
      message: "Password reset email sent"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};



// ============================
// RESET PASSWORD
// ============================
exports.resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};