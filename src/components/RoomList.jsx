'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const searchParams = useSearchParams();
  const city = searchParams.get('city');

  const fetchRooms = async () => {
    try {
      const res = await fetch(`https://room-mates-project.vercel.app/api/searchcity${city ? `?city=${encodeURIComponent(city)}` : ''}`);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [city]);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#1c4475]">
        {city ? `Rooms in ${city}` : 'Available Rooms'}
      </h2>

      {rooms.length === 0 ? (
        <p className="text-center mt-5">No rooms available.</p>
      ) : (
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
      )}
    </div>
  );
};

export default RoomList;
