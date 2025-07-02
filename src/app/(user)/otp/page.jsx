import { Suspense } from "react";
import Otp from "@/components/Otp";

const page = () => {
  return (
    <div>
      <Suspense fallback={<p className="text-center mt-5">Loading OTP...</p>}>
        <Otp />
      </Suspense>
    </div>
  );
};

export default page;
