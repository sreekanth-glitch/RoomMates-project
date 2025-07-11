'use client';

import { useEffect, useState } from 'react';

const AllRoom = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('https://room-mates-brown.vercel.app/api/getallrooms');
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  if (rooms.length === 0) return <p className="text-center mt-5">No rooms available.</p>;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#1c4475]">Available Rooms</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-[#1c4475] mb-2">{room.name}</h3>
            <p><strong>Phone:</strong> {room.phone}</p>
            <p><strong>City:</strong> {room.city}</p>
            <p><strong>Area:</strong> {room.area || 'N/A'}</p>
            <p><strong>Total Rent:</strong> ₹{room.total || 'N/A'}</p>
            <p><strong>Per Head:</strong> ₹{room.perHead || 'N/A'}</p>
            <p><strong>Description:</strong> {room.description || 'No description'}</p>
            {room.image && (
              <img
                src={room.image}
                alt="Room"
                className="mt-2 w-full h-48 object-cover rounded-lg border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRoom;
