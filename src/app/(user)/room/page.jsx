
import IfRoom from '@/components/IfRoom';
import RoomForm from '@/components/RoomForm';

const Room = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side (full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2">
        <RoomForm />
      </div>

      {/* Vertical Line for desktop, hidden on mobile */}
      <div className="hidden md:flex justify-center items-center">
        <div
          className="bg-gray-400"
          style={{ width: '2px', height: '90%', marginTop: '5%', marginBottom: '5%' }}
        />
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <IfRoom />
      </div>
    </div>
  );
};

export default Room;
