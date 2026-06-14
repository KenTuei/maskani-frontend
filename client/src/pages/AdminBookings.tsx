// src/pages/AdminBookings.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Booking type
export interface Booking {
  id: string;
  userId: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  date: string;
  time: string;
  status: "requested" | "approved" | "declined" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

// Simple badge component
const BookingStatusBadge: React.FC<{ status: Booking["status"] }> = ({
  status,
}) => {
  const colors: Record<Booking["status"], string> = {
    requested: "bg-yellow-200 text-yellow-800",
    approved: "bg-green-200 text-green-800",
    declined: "bg-red-200 text-red-800",
    completed: "bg-blue-200 text-blue-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/admin/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        alert("Error fetching bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="p-8">Loading bookings...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Property</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-3 border">{b.id}</td>
                <td className="p-3 border">{b.userName}</td>
                <td className="p-3 border">{b.propertyName}</td>
                <td className="p-3 border">{b.date}</td>
                <td className="p-3 border">{b.time}</td>
                <td className="p-3 border">
                  <BookingStatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
