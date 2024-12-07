const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables from .env file

// Models
const User = require("./models/user");
const Room = require("./models/room");

// Utility function to generate hashes
const generateHash = (inputString) => {
  const hash = crypto.createHash("sha256").update(inputString).digest();
  return hash.toString("base64");
};

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Frontend URL from .env or default
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies
  allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
}));
app.options("*", cors()); 
app.use(bodyParser.json());



// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key", // Use environment variable for session secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Use true for HTTPS
      httpOnly: true,
      sameSite: "lax", // Prevent CSRF while allowing navigation
    },
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes with /api prefix
const router = express.Router();

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to GhostLink Backend");
});
// User Registration
router.post("/user", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = new User({ user_name, password: hashedPassword });
    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const user = await User.findOne({ user_name });
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: "Incorrect password" });

    req.session.user = { user_name: user.user_name }; // Save user info in session
    console.log("After login: Session created:", req.session);
    res.status(200).send({ message: "Login successful!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Check Session
router.get("/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).send({ user: req.session.user });
  } else {
    res.status(401).send({ message: "Not logged in" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ message: "Could not log out" });
    res.clearCookie("connect.sid");
    res.status(200).send({ message: "Logged out successfully!" });
  });
});

// Room Management
router.post("/room", async (req, res) => {
  const { room_name, description } = req.body;
  try {
    const newRoom = new Room({ room_name, description });
    await newRoom.save();
    res.status(201).send({ message: "Room created successfully", room_id: newRoom._id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/room/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    const rooms = await Room.find({ room_name: { $regex: keyword, $options: "i" } });
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/room/:room_name/join", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ message: "Unauthorized. Please log in." });

  const { room_name } = req.params;
  const user_name = req.session.user.user_name;
  try {
    const room = await Room.findOne({ room_name });
    if (!room) return res.status(404).send({ message: "Room not found" });

    res.status(200).send({ message: `${user_name} joined the room successfully` });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/room/:room_name/message", async (req, res) => {
  const { room_name } = req.params;
  try {
    const room = await Room.findOne({ room_name }, "message");
    if (room) res.status(200).send(room.message);
    else res.status(404).send({ message: "Room not found" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/room/:room_name/message", async (req, res) => {
  const { room_name } = req.params;
  const { message } = req.body;
  const user_name = req.session?.user?.user_name;
  const hashString = user_name + room_name;
  const hashedValue = generateHash(hashString);

  if (!user_name) return res.status(401).send({ message: "Unauthorized. Please log in." });
  if (!message || !message.content) return res.status(400).send({ message: "Message content is required." });

  try {
    const room = await Room.findOneAndUpdate(
      { room_name },
      { $push: { message: { ...message, user_name: hashedValue } } },
      { new: true }
    );
    if (room) res.status(200).send({ message: "Message added successfully", updatedRoom: room });
    else res.status(404).send({ message: "Room not found" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Mount Router on /api Prefix
app.use("/api", router);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

