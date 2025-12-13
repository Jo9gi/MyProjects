import Request from "../models/RequestModel.js";
import Inventory from "../models/inventoryModel.js";

// 1. Create Blood Request
export const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, reason, hospitalName, urgency } = req.body;

    // Check inventory availability
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
    const available = inVal - outVal;

    let message = "Request submitted successfully";
    let status = "Pending";
    
    // Check if stock is low or unavailable
    if (available <= 0) {
      message = "Request submitted but blood type is currently unavailable";
      status = "Unavailable";
    } else if (available <= 10) {
      message = "Request submitted but stock is low for this blood type";
    }

    const request = await Request.create({
      recipient: req.user._id,
      bloodGroup,
      units,
      reason,
      hospitalName,
      urgency,
      status
    });

    return res.status(201).json({
      success: true,
      message,
      data: request,
      stockInfo: {
        available,
        isLow: available <= 5,
        isUnavailable: available <= 0
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get Requests of Logged-In Recipient
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ recipient: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Cancel Own Request
export const cancelRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id.toString();

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.recipient.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this request" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending requests can be cancelled" });
    }

    request.status = "Cancelled";
    await request.save();

    return res.status(200).json({ success: true, message: "Request cancelled", data: request });

  } catch (error) {
    console.error("CANCEL REQUEST ERROR ---->");
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// 4. Admin: Update Request Status
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = status;
    if (status === "Rejected") request.rejectionReason = rejectionReason;
    await request.save();

    // Auto-decrease inventory on request approval
    if (status === "Approved") {
      const reqBlood = request.bloodGroup;
      const reqQty = request.units;

      // Check if enough stock is available
      const totalIn = await Inventory.aggregate([
        { $match: { bloodGroup: reqBlood, inventoryType: "IN" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      const totalOut = await Inventory.aggregate([
        { $match: { bloodGroup: reqBlood, inventoryType: "OUT" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      const inVal = totalIn[0]?.total || 0;
      const outVal = totalOut[0]?.total || 0;
      const available = inVal - outVal;

      if (available < reqQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${available}, Requested: ${reqQty}`
        });
      }

      // Add OUT inventory record to decrease stock (shared organisation)
      const sharedOrgId = "691d87bf401d592f4af89766"; // Kasim's ID
      
      await Inventory.create({
        inventoryType: "OUT",
        bloodGroup: reqBlood,
        quantity: reqQty,
        organisation: sharedOrgId,
        patient: request.recipient
      });

      console.log(`Inventory updated: -${reqQty} for ${reqBlood}`);
    }

    return res.status(200).json({
      success: true,
      message: "Status updated",
      data: request
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};