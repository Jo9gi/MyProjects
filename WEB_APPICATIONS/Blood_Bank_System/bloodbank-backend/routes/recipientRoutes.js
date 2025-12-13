import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  createBloodRequest,
  getMyRequests,
  cancelRequest,
  updateRequestStatus
} from "../controllers/recipientController.js";

const router = express.Router();

// Recipient Endpoints
router.post("/request", authMiddleware, createBloodRequest);
router.get("/my-requests", authMiddleware, getMyRequests);
router.put("/cancel/:id", authMiddleware, cancelRequest);

// Admin endpoint
router.put("/update-status/:id", authMiddleware, updateRequestStatus);

export default router;