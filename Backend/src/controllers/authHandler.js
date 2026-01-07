const User = require("../models/UserSchema");
const crypto = require("crypto");
const { generateToken } = require("../utils/tokenGenerator");

const jwt = require("jsonwebtoken");

// SHA256 password hashing
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

exports.register = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.email) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Validate password strength
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const hash = hashPassword(req.body.password);
    const user = await User.create({ ...req.body, password: hash });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const normalizedEmail = email.trim().toLowerCase();

    // select password explicitly
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // compare SHA256 hashed password
    const hashedInputPassword = hashPassword(password);
    if (hashedInputPassword !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};


// verify JWT token middleware
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// role-based authorization middleware
exports.authorizeRoles = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};


exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

