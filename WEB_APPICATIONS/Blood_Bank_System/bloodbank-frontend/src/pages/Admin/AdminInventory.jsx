import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

// Blood groups order
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const LOW_STOCK_THRESHOLD = 10;

export default function AdminInventory() {
  const [inventory, setInventory] = useState({}); // { "A+": 10, ... }
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | remove
  const [modalGroup, setModalGroup] = useState("A+");
  const [modalQty, setModalQty] = useState(0);
  const [modalError, setModalError] = useState("");

  // selected card for quick open
  const openModal = (mode, group) => {
    setModalMode(mode);
    setModalGroup(group);
    setModalQty(1);
    setModalError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalError("");
  };

  // Load inventory from backend
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/inventory/stats");
      const stats = res.data?.data || {};
      // transform stats to map with available quantities
      const map = {};
      // initialize all groups with 0 first
      BLOOD_GROUPS.forEach(g => map[g] = 0);
      // populate with actual available quantities
      Object.keys(stats).forEach(group => {
        if (BLOOD_GROUPS.includes(group)) {
          map[group] = Math.max(0, stats[group].available || 0);
        }
      });
      setInventory(map);
    } catch (err) {
      console.error("Failed to load inventory", err);
      // fallback: set zeros
      const zeroMap = {};
      BLOOD_GROUPS.forEach(g => zeroMap[g] = 0);
      setInventory(zeroMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchInventory().finally(() => setRefreshing(false));
    }, 10000); // 10s
    return () => clearInterval(interval);
  }, []);

  // Helper to update inventory map locally
  const updateLocalInventory = (group, delta) => {
    setInventory(prev => {
      const copy = { ...prev };
      copy[group] = Math.max(0, (Number(copy[group] || 0) + Number(delta || 0)));
      return copy;
    });
  };

  // Add or Remove API call
  const submitInventoryChange = async () => {
    setModalError("");
    const qty = Number(modalQty);
    if (!modalGroup || !BLOOD_GROUPS.includes(modalGroup)) {
      setModalError("Invalid blood group.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setModalError("Quantity must be a positive number.");
      return;
    }

    // if remove, ensure enough stock locally to prevent negative
    if (modalMode === "remove" && (Number(inventory[modalGroup] || 0) - qty) < 0) {
      setModalError("Insufficient stock for removal.");
      return;
    }

    try {
      const payload = {
        inventoryType: modalMode === "add" ? "IN" : "OUT",
        bloodGroup: modalGroup,
        quantity: qty
      };

      console.log('Sending payload:', payload);
      console.log('Current inventory before:', inventory[modalGroup]);

      // optimistic UI update
      const delta = modalMode === "add" ? qty : -qty;
      updateLocalInventory(modalGroup, delta);

      // API call
      const response = await axiosInstance.post("/inventory/add", payload);
      console.log('API response:', response.data);

      // success - close modal
      closeModal();
    } catch (err) {
      console.error("Inventory update failed", err);
      console.error("Error response:", err.response?.data);
      // rollback optimistic update
      const rollback = modalMode === "add" ? -qty : qty;
      updateLocalInventory(modalGroup, rollback);

      // readable message
      const msg = err?.response?.data?.message || err?.message || "Failed to update inventory";
      setModalError(msg);
    }
  };

  // Utility: render a single card
  const Card = ({ group, qty }) => {
    const isLow = Number(qty || 0) <= LOW_STOCK_THRESHOLD;
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col justify-between">
        <div>
          <div className="text-sm text-gray-500">Blood Group</div>
          <div className="mt-2 text-2xl font-bold">{group}</div>

          <div className="mt-4 text-xs text-gray-500">Available units</div>
          <div className="text-3xl font-semibold mt-1">{qty}</div>

          {isLow && (
            <div className="mt-3 inline-block px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Low stock
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50"
            onClick={() => openModal("remove", group)}
            aria-label={`Remove units for ${group}`}
          >
            − Remove
          </button>

          <button
            className="px-3 py-1 text-sm bg-black text-white rounded hover:opacity-95"
            onClick={() => openModal("add", group)}
            aria-label={`Add units for ${group}`}
          >
            + Add
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setRefreshing(true); fetchInventory().finally(() => setRefreshing(false)); }}
            className="px-3 py-2 border rounded bg-blue-100 hover:bg-gray-50 text-sm"
          >
            Refresh
          </button>
          <div className="text-sm text-gray-600">{ refreshing ? "Refreshing..." : "" }</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {BLOOD_GROUPS.map(g => (
          <Card key={g} group={g} qty={Number(inventory[g] || 0)} />
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{modalMode === "add" ? "Add Units" : "Remove Units"}</h3>
                <p className="text-sm text-gray-600">Blood group: <strong>{modalGroup}</strong></p>
              </div>
              <button onClick={closeModal} className="text-gray-500">✕</button>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={modalQty}
                onChange={(e) => setModalQty(e.target.value)}
                className="w-full p-2 border rounded"
              />
              {modalError && <div className="mt-2 text-sm text-red-600">{modalError}</div>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-3 py-2 rounded border bg-white">Cancel</button>
              <button
                onClick={submitInventoryChange}
                className="px-4 py-2 rounded bg-black text-white"
              >
                {modalMode === "add" ? "Add Units" : "Remove Units"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 p-4 rounded shadow">Loading inventory...</div>
        </div>
      )}
    </div>
  );
}