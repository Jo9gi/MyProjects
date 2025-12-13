import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import Header from '../components/Header';
import { Menu } from '@headlessui/react';

// Small utility to format date
const formatDate = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return '-'; }
};

// Avatar initials
const Initials = ({ name }) => {
  const initials = (name || 'U').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-800">
      {initials}
    </div>
  );
};

// Confirm dialog (simple)
const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded bg-red-500 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
};

// Role change modal
const RoleModal = ({ open, onClose, user, onSave }) => {
  const [role, setRole] = useState(user?.role || 'User');

  useEffect(() => { setRole(user?.role || 'User'); }, [user]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-2">Edit Role</h3>
        <p className="text-sm text-gray-600 mb-4">Change role for <strong>{user?.name}</strong></p>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={() => onSave(role)} className="px-3 py-2 rounded bg-blue-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default function AdminUsers() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // action states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [confirmState, setConfirmState] = useState({ open:false, type: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/users');
      // API could return array or envelope; normalize
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.users || []);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
      setUsers([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // client-side search
  const filtered = users.filter(u => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  // actions
  const handleOpenRole = (u) => { setSelectedUser(u); setShowRoleModal(true); };

  const handleSaveRole = async (role) => {
    if (!selectedUser) return;
    try {
      const id = selectedUser._id || selectedUser.id;
      await axios.put(`/admin/users/${id}/role`, { role });
      // optimistic update
      setUsers(prev => prev.map(p => p._id === id || p.id === id ? {...p, role } : p));
      setShowRoleModal(false);
    } catch (err) {
      console.error('Failed to change role', err);
      alert('Failed to change role');
    }
  };

  const handleBlockUnblock = (user) => {
    setSelectedUser(user);
    setConfirmState({ open: true, type: user.isBlocked ? 'unblock' : 'block' });
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setConfirmState({ open: true, type: 'delete' });
  };

  const runConfirm = async () => {
    const user = selectedUser; if (!user) return;
    const id = user._id || user.id;
    const type = confirmState.type;

    try {
      if (type === 'delete') {
        await axios.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(p => p._id !== id && p.id !== id));
      } else if (type === 'block' || type === 'unblock') {
        const newStatus = type === 'block' ? 'blocked' : 'active';
        await axios.put(`/admin/users/${id}/status`, { status: newStatus });
        setUsers(prev => prev.map(p => p._id === id || p.id === id ? {...p, status: newStatus, isBlocked: newStatus === 'blocked'} : p));
      }
    } catch (err) {
      console.error('Action failed', err);
      alert('Action failed');
    } finally {
      setConfirmState({ open:false, type: null });
      setSelectedUser(null);
    }
  };

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Users</h1>
          <div className="w-80">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name or email"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Created</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id || u.id} className="border-t">
                  <td className="p-4 flex items-center gap-3">
                    <Initials name={u.name} />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-gray-500">{u._id || u.id}</div>
                    </div>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${u.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.status === 'blocked' ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-right">
                    <div className="inline-block text-left">
                      <Menu>
                        <Menu.Button className="px-3 py-1 bg-gray-100 rounded">⋮</Menu.Button>
                        <Menu.Items className="mt-2 w-48 bg-white shadow rounded">
                          <div className="p-2">
                            <button onClick={() => handleOpenRole(u)} className="block w-full text-left p-2 rounded hover:bg-gray-50">Change Role</button>
                            <button onClick={() => handleBlockUnblock(u)} className="block w-full text-left p-2 rounded hover:bg-gray-50">{u.status === 'blocked' ? 'Unblock' : 'Block'}</button>
                            <button onClick={() => handleDelete(u)} className="block w-full text-left p-2 rounded hover:bg-gray-50 text-red-600">Delete</button>
                          </div>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <RoleModal open={showRoleModal} onClose={() => setShowRoleModal(false)} user={selectedUser} onSave={handleSaveRole} />

        <ConfirmDialog
          open={confirmState.open}
          title={confirmState.type === 'delete' ? 'Delete User' : confirmState.type === 'block' ? 'Block User' : 'Confirm' }
          message={confirmState.type === 'delete' ? `Permanently delete ${selectedUser?.name}? This cannot be undone.` : confirmState.type === 'block' ? `Change status for ${selectedUser?.name}?` : ''}
          onCancel={() => setConfirmState({ open:false, type:null })}
          onConfirm={runConfirm}
        />
      </div>
    </div>
  );
}