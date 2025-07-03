import { Suspense } from "react";
import Login from "@/components/Login";

const page = () => {
  return (
    <div>
      <Suspense fallback={<p className="text-center mt-5"></p>}>
        <Login />
      </Suspense>
    </div>
  );
};

export default page;
