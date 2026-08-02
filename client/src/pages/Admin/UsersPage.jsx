import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage if available
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
        withCredentials: true,
      };

      let response;

      // Attempt fetching from /api/admin/users, with fallback to /api/users
      try {
        response = await axios.get("/api/admin/users", config);
      } catch (adminErr) {
        if (adminErr.response?.status === 404) {
          response = await axios.get("/api/users", config);
        } else {
          throw adminErr;
        }
      }

      const data = response.data;

      // Extract users array safely regardless of response payload format
      const userList = Array.isArray(data) ? data : data.data || [];
      setUsers(userList);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch users. Please check server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler to update user role directly from the dropdown
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);

      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      // Attempt endpoint update with fallback logic
      try {
        await axios.patch(
          `/api/admin/users/${userId}/role`,
          { role: newRole },
          config
        );
      } catch (patchErr) {
        if (
          patchErr.response?.status === 404 ||
          patchErr.response?.status === 405
        ) {
          await axios.put(
            `/api/users/${userId}`,
            { role: newRole },
            config
          );
        } else {
          throw patchErr;
        }
      }

      // Optimistically update local React state for immediate feedback
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Role Update Error:", err);
      alert(
        err.response?.data?.message || "Failed to update user role. Please try again."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 text-sm">
            Manage registered accounts and user roles.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow flex items-center gap-2 transition cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <input
          type="text"
          placeholder="Search by Name, Email, or User ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((user) => {
                const currentRole = user.role || (user.isAdmin ? "admin" : "user");

                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono text-xs text-indigo-600">
                      {user._id}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      {/* Interactive Role Dropdown */}
                      <div className="relative inline-block">
                        <select
                          value={currentRole}
                          disabled={updatingUserId === user._id}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all ${
                            currentRole === "admin"
                              ? "bg-purple-100 text-purple-700 border-purple-200 focus:ring-2 focus:ring-purple-400"
                              : currentRole === "hotelOwner" || currentRole === "hotel_owner"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 focus:ring-2 focus:ring-emerald-400"
                              : "bg-blue-100 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
                          } ${
                            updatingUserId === user._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="hotelOwner">Hotel Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;