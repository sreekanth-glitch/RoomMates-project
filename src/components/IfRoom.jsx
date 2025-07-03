'use client';

import React, { useEffect, useState } from 'react';

const API_URL = 'https://room-mates-brown.vercel.app';

const FetchRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRooms = async () => {
    try {
      const loginToken = localStorage.getItem('token');
      if (!loginToken) return;

      const response = await fetch(`${API_URL}/api/getrooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": loginToken,
        },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("Failed to fetch rooms:", data.message || data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const deleteRoomById = async (roomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      const loginToken = localStorage.getItem('token');
      if (!loginToken) return;

      setDeletingId(roomId);

      const response = await fetch(`${API_URL}/api/deleteroom/${roomId}`, {
        method: 'DELETE',
        headers: {
          "token": loginToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
        setRooms(prev => prev.filter(room => room._id !== roomId));
      } else {
        alert("Failed to delete room.");
        console.error("Delete failed:", data?.message || data?.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the room.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="px-4 md:px-8 py-6">
      {deleteSuccess && (
        <div className="mb-4 text-green-600 font-semibold bg-green-100 px-4 py-2 rounded">
          ✓ Room Deleted Successfully
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">
          <p>Sorry, have not uploaded any Room details</p>
        </div>
      ) : (
        <div>
          <table className="w-full text-left text-gray-700 border rounded-lg shadow">
            <thead className="text-xs text-orange-400 uppercase bg-[#1c4475]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone No</th>
                <th className="px-4 py-2">Total Rent</th>
                <th className="px-4 py-2">Rent Per Head</th>
                <th className="px-4 py-2">Area</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Room Image</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-400">
              {rooms.map(room => (
                <tr key={room._id}>
                  <td className="px-4 py-2 border border-gray-300">{room.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.phone}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.total}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.perHead}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.area}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.city}</td>
                  <td className="px-4 py-2 border border-gray-300">{room.description}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {room.image && (
                      <img
                        src={`${room.image}`}
                        alt={room.city}
                        className="w-20 h-16 object-cover rounded border"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => deleteRoomById(room._id)}
                      disabled={deletingId === room._id}
                      className={`px-3 py-1 cursor-pointer text-orange-400 text-xs font-medium rounded active:scale-95 ${
                        deletingId === room._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#1c4475] hover:bg-[#0f2947]'
                      }`}
                    >
                      {deletingId === room._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FetchRooms;
