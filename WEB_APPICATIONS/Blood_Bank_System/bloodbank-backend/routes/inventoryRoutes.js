import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addInventoryController,
  getInventoryController,
  getBloodStatsController,
  getPublicBloodAvailability
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addInventoryController);
router.get("/list", authMiddleware, getInventoryController);
router.get("/stats", authMiddleware, getBloodStatsController);
router.get("/availability", authMiddleware, getPublicBloodAvailability);

// Test endpoint to add sample inventory data
router.post("/test-data", authMiddleware, async (req, res) => {
  try {
    const testData = [
      { bloodGroup: "A+", quantity: 10 },
      { bloodGroup: "A-", quantity: 5 },
      { bloodGroup: "B+", quantity: 8 },
      { bloodGroup: "B-", quantity: 3 },
      { bloodGroup: "AB+", quantity: 6 },
      { bloodGroup: "AB-", quantity: 2 },
      { bloodGroup: "O+", quantity: 15 },
      { bloodGroup: "O-", quantity: 4 }
    ];

    for (const item of testData) {
      await Inventory.create({
        inventoryType: "IN",
        bloodGroup: item.bloodGroup,
        quantity: item.quantity,
        organisation: req.user._id
      });
    }

    res.json({ success: true, message: "Test data added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple endpoint to add global test data (no auth required for testing)
router.get("/init-data", async (req, res) => {
  try {
    // Check if data already exists
    const existing = await Inventory.findOne({});
    if (existing) {
      return res.json({ success: true, message: "Data already exists" });
    }

    const testData = [
      { bloodGroup: "A+", quantity: 12 },
      { bloodGroup: "A-", quantity: 7 },
      { bloodGroup: "B+", quantity: 9 },
      { bloodGroup: "B-", quantity: 4 },
      { bloodGroup: "AB+", quantity: 6 },
      { bloodGroup: "AB-", quantity: 3 },
      { bloodGroup: "O+", quantity: 18 },
      { bloodGroup: "O-", quantity: 5 }
    ];

    // Create a dummy organization ID for global inventory
    const dummyOrgId = "507f1f77bcf86cd799439011";

    for (const item of testData) {
      await Inventory.create({
        inventoryType: "IN",
        bloodGroup: item.bloodGroup,
        quantity: item.quantity,
        organisation: dummyOrgId
      });
    }

    res.json({ success: true, message: "Global test data initialized" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
