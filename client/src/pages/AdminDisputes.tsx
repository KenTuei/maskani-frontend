// src/pages/AdminDisputes.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Represents a dispute made by a user
interface Dispute {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt?: string;
}

const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:5000/admin/disputes",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDisputes(response.data);
      } catch (err) {
        console.error("Failed to fetch disputes:", err);
        alert("Error fetching disputes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: Dispute["status"],
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:5000/admin/disputes/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDisputes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating dispute status.");
    }
  };

  if (loading) return <p className="p-8">Loading disputes...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Disputes</h1>
      {disputes.length === 0 ? (
        <p>No disputes found.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Property</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id} className="hover:bg-gray-50">
                <td className="p-3 border">{dispute.id}</td>
                <td className="p-3 border">{dispute.userName}</td>
                <td className="p-3 border">{dispute.propertyName}</td>
                <td className="p-3 border">{dispute.reason}</td>
                <td className="p-3 border capitalize">{dispute.status}</td>
                <td className="p-3 border space-x-2">
                  {dispute.status !== "resolved" && (
                    <button
                      onClick={() => handleStatusChange(dispute.id, "resolved")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
                  {dispute.status !== "dismissed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(dispute.id, "dismissed")
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Dismiss
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

export default AdminDisputes;
