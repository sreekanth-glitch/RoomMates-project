import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div>
      <Suspense fallback={<p className="text-center mt-5">Loading registration form...</p>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default Register;
