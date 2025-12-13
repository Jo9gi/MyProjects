import Inventory from "../models/inventoryModel.js";
import User from "../models/userModel.js";

// ADD INVENTORY (IN/OUT)
export const addInventoryController = async (req, res) => {
  try {
    const { inventoryType, bloodGroup, quantity, donorId, patientId } = req.body;

    if (inventoryType === "OUT") {
      // before deducting blood, check if available
      const totalIn = await Inventory.aggregate([
        { $match: { bloodGroup, inventoryType: "IN" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      const totalOut = await Inventory.aggregate([
        { $match: { bloodGroup, inventoryType: "OUT" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      const inVal = totalIn[0]?.total || 0;
      const outVal = totalOut[0]?.total || 0;

      if (quantity > inVal - outVal) {
        return res.status(400).json({
          success: false,
          message: "Insufficient blood stock"
        });
      }
    }

    // Use shared organisation for all admins (Kasim's ID)
    const sharedOrgId = "691d87bf401d592f4af89766"; // Kasim's ID
    
    const inventory = new Inventory({
      inventoryType,
      bloodGroup,
      quantity,
      organisation: sharedOrgId,
      donor: donorId || null,
      patient: patientId || null
    });

    await inventory.save();
    return res.status(201).json({ success: true, message: "Inventory updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL INVENTORY
export const getInventoryController = async (req, res) => {
  try {
    const inventory = await Inventory.find({})
      .populate("donor")
      .populate("patient")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET BLOOD STATS (Global data for all users including admins)
export const getBloodStatsController = async (req, res) => {
  try {
    // Show global inventory data for all users (including admins)
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: { bloodGroup: "$bloodGroup", type: "$inventoryType" },
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // 2. Transform the result into a clean, readable structure
    const formattedStats = {};

    stats.forEach(item => {
      const bg = item._id.bloodGroup;
      const type = item._id.type;

      if (!formattedStats[bg]) {
        formattedStats[bg] = { in: 0, out: 0, available: 0 };
      }

      if (type === "IN") {
        formattedStats[bg].in = item.total;
      } else if (type === "OUT") {
        formattedStats[bg].out = item.total;
      }

      formattedStats[bg].available =
        formattedStats[bg].in - formattedStats[bg].out;
    });

    return res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blood statistics"
    });
  }
};

// GET PUBLIC BLOOD AVAILABILITY (All users can see global inventory)
export const getPublicBloodAvailability = async (req, res) => {
  try {
    // Aggregate total IN and OUT for each blood group (global)
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: { bloodGroup: "$bloodGroup", type: "$inventoryType" },
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // Transform the result into a clean, readable structure
    const formattedStats = {};

    stats.forEach(item => {
      const bg = item._id.bloodGroup;
      const type = item._id.type;

      if (!formattedStats[bg]) {
        formattedStats[bg] = { in: 0, out: 0, available: 0 };
      }

      if (type === "IN") {
        formattedStats[bg].in = item.total;
      } else if (type === "OUT") {
        formattedStats[bg].out = item.total;
      }

      formattedStats[bg].available = Math.max(0, formattedStats[bg].in - formattedStats[bg].out);
    });

    return res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blood availability"
    });
  }
};
