import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div>
      <Suspense fallback={<p className="text-center mt-5"></p>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default Register;
