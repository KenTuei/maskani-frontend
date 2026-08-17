// src/pages/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Represents a user in the system
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "realtor" | "hunter" | "leaser";
  approved: boolean;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        alert("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApproval = async (id: string, approve: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:5000/admin/users/${id}`,
        { approved: approve },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, approved: approve } : user,
        ),
      );
    } catch (err) {
      console.error("Failed to update approval:", err);
      alert("Error updating user approval.");
    }
  };

  if (loading) return <p className="p-8">Loading users...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Approved</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border">{user.id}</td>
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border capitalize">{user.role}</td>
                <td className="p-3 border">{user.approved ? "Yes" : "No"}</td>
                <td className="p-3 border space-x-2">
                  {!user.approved && (
                    <button
                      onClick={() => handleApproval(user.id, true)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  {user.approved && (
                    <button
                      onClick={() => handleApproval(user.id, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
