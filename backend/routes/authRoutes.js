const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Register request received:", email);

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    console.log("User saved to database");

    res.status(201).json("User registered successfully");

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", email);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json("Server error");
  }
});

module.exports = router;