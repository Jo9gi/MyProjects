import express from "express";
import BloodSample from "../models/BloodSample.js";
import Inventory from "../models/inventoryModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Blood routes working" });
});

// Add blood sample
router.post("/add", async (req, res) => {
  try {
    const { donorId, bloodGroup, units, donationDate } = req.body;

    if (!donorId || !bloodGroup || !units || !donationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSample = await BloodSample.create({
      donorId,
      bloodGroup,
      units,
      donationDate,
    });

    res.json({
      message: "Blood sample registered successfully",
      data: newSample,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all donations by donor
router.get("/donations/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params;

    const donations = await BloodSample.find({ donorId }).sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all donations (Admin)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const donations = await BloodSample.find({}).populate('donorId', 'name email').sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Withdraw donation
router.put("/withdraw/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;

    const donation = await BloodSample.findById(donationId);
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "Pending") {
      return res.status(400).json({ message: "Only pending donations can be withdrawn" });
    }

    donation.status = "Cancelled";
    await donation.save();

    res.json({ 
      success: true, 
      message: "Donation withdrawn successfully" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update donation status
router.put("/status/:donationId", authMiddleware, async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await BloodSample.findById(donationId);
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.status = status;
    await donation.save();

    // Auto-increase inventory on donation approval
    if (status === "Approved") {
      const blood = donation.bloodGroup;
      const qty = donation.units;

      // Add IN inventory record to increase stock (shared organisation)
      const sharedOrgId = "691d87bf401d592f4af89766"; // Kasim's ID
      
      await Inventory.create({
        inventoryType: "IN",
        bloodGroup: blood,
        quantity: qty,
        organisation: sharedOrgId,
        donor: donation.donorId
      });

      console.log(`Inventory updated: +${qty} for ${blood}`);
    }

    res.json({ 
      success: true, 
      message: "Donation status updated successfully",
      data: donation
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;