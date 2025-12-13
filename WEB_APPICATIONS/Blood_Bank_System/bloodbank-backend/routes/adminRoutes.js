import express from "express";
import { 
  getDashboardData,
  getSystemHealth,
  getAllUsers,
  getAllRequests,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateRequestStatus
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// MAIN DASHBOARD ENDPOINT
router.get("/dashboard", authMiddleware, getDashboardData);

// SYSTEM HEALTH
router.get("/health", getSystemHealth);

// USER MANAGEMENT ENDPOINTS
router.get("/users", authMiddleware, getAllUsers);
router.put("/users/:id/role", authMiddleware, updateUserRole);
router.put("/users/:id/status", authMiddleware, updateUserStatus);
router.delete("/users/:id", authMiddleware, deleteUser);

// REQUESTS ENDPOINTS
router.get("/requests", authMiddleware, getAllRequests);
router.put("/requests/:id", authMiddleware, updateRequestStatus);

export default router;