import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import auth from "./middleware/authMiddleware.js";
import permit, { checkAdmin } from "./middleware/roleMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/admin", adminRoutes);

// Protected test routes
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "Protected route OK", user: req.user });
});

app.get("/api/admin-only", auth, checkAdmin, (req, res) => {
  res.json({ message: "Admin route OK" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
