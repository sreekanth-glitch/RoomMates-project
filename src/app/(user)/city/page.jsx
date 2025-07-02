import RoomList from "@/components/RoomList";
import { Suspense } from "react";

const City = () => {
  return (
    <div>
      <Suspense fallback={<p className="text-center mt-5">Loading rooms...</p>}>
        <RoomList />
      </Suspense>
    </div>
  );
};

export default City;
