import User from "../models/userModel.js";
import BloodSample from "../models/BloodSample.js";
import RequestModel from "../models/RequestModel.js";
import inventoryModel from "../models/inventoryModel.js";
import mongoose from "mongoose";

// SINGLE DASHBOARD ENDPOINT - PRODUCTION GRADE
export const getDashboardData = async (req, res) => {
  try {
    // Parallel queries for performance
    const [users, requests, inventory, donations] = await Promise.all([
      User.find({}).select("-password"),
      RequestModel.find({}).populate('recipient', 'name').sort({ createdAt: -1 }),
      inventoryModel.find({}),
      BloodSample.find({}).sort({ donationDate: -1 })
    ]);

    // User role distribution
    const userStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    // Request status distribution
    const requestStats = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});

    // Blood inventory by type
    const inventoryStats = inventory.reduce((acc, item) => {
      acc[item.bloodType] = (acc[item.bloodType] || 0) + (item.quantity || 0);
      return acc;
    }, {});

    // Recent activity (last 10)
    const recentActivity = requests.slice(0, 10).map(req => ({
      type: 'request',
      message: `${req.status === 'Pending' ? 'New' : req.status} ${req.bloodGroup} request`,
      user: req.recipient?.name || 'Unknown',
      time: req.createdAt,
      status: req.status
    }));

    // Add donation activities
    donations.slice(0, 5).forEach(donation => {
      recentActivity.push({
        type: 'donation',
        message: `New ${donation.bloodType} donation received`,
        user: 'Donor',
        time: donation.donationDate,
        status: 'completed'
      });
    });

    // Sort by time and limit
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
    recentActivity.splice(10);

    const dashboardData = {
      users: {
        total: users.length,
        donors: userStats.donor || 0,
        recipients: userStats.recipient || 0,
        admins: userStats.admin || 0
      },
      requests: {
        total: requests.length,
        pending: requestStats.pending || 0,
        approved: requestStats.approved || 0,
        rejected: requestStats.rejected || 0,
        completed: requestStats.completed || 0
      },
      inventory: {
        totalUnits: Object.values(inventoryStats).reduce((sum, qty) => sum + qty, 0),
        byBloodType: inventoryStats
      },
      donations: {
        total: donations.length,
        thisMonth: donations.filter(d => 
          new Date(d.donationDate).getMonth() === new Date().getMonth()
        ).length
      },
      recentActivity,
      lastUpdated: new Date()
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SYSTEM HEALTH CHECK
export const getSystemHealth = async (req, res) => {
  try {
    // Test MongoDB connection
    await mongoose.connection.db.admin().ping();
    
    res.status(200).json({
      mongo: "online",
      api: "online",
      uptime: process.uptime(),
      timestamp: new Date(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      mongo: "offline",
      api: "online",
      uptime: process.uptime(),
      timestamp: new Date(),
      error: error.message
    });
  }
};

// LEGACY ENDPOINTS (Keep for compatibility)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestModel.find({}).populate('recipient', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['User', 'Admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER STATUS
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Status updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE REQUEST STATUS
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Update request status - ID:', id, 'Status:', status);
    console.log('Request body:', req.body);

    if (!['Pending', 'Approved', 'Rejected', 'Fulfilled', 'Unavailable'].includes(status)) {
      console.log('Invalid status provided:', status);
      return res.status(400).json({ message: `Invalid status: ${status}. Valid statuses are: Pending, Approved, Rejected, Fulfilled, Unavailable` });
    }

    const request = await RequestModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Auto-decrease inventory on request approval
    if (status === "Approved") {
      const reqBlood = request.bloodGroup;
      const reqQty = request.units;

      // Add OUT inventory record to decrease stock
      await inventoryModel.create({
        inventoryType: "OUT",
        bloodGroup: reqBlood,
        quantity: reqQty,
        organisation: req.user._id,
        patient: request.recipient
      });

      console.log(`Inventory updated: -${reqQty} for ${reqBlood}`);
    }

    res.json({ message: "Request status updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};