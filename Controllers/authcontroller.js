const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const register = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.status(200).json({
//       token,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login request:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 👇 log before using JWT
    console.log("Generating token for user:", user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Login error:", error); // ✅ will show exact error
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login };
