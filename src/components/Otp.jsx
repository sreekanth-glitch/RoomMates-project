'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Otp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0); // Track number of resends

  useEffect(() => {
    if (timer === 0) {
      setIsButtonDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://room-mates-project.vercel.app/api/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtp('');
        router.push('/login');
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleResend = async () => {
    if (resendCount >= 1) {
      setError('Your OTP limit is over. Please register again.');
      return;
    }

    setIsButtonDisabled(true);
    setTimer(120); // Set to 2 minutes
    setResendCount(prev => prev + 1);

    try {
      const res = await fetch('http://localhost:3000/api/resendotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('OTP Resent');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch {
      setError('Error resending OTP');
    }
  };

  return (
    <div className=" bg-gray-100 px-10 pt-30 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1c4475]">
            OTP Verify
          </h2>

          <div>
            <input
              type="text"
              placeholder="Enter your valid OTP"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm -mt-2">{error}</p>
          )}

          <div className="flex items-center justify-between gap-10">
            <button
              type="submit"
              className="w-full py-2.5 cursor-pointer bg-[#1c4475] text-orange-400 font-semibold rounded-md hover:bg-[#0f2947] transition duration-300 active:scale-95">
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isButtonDisabled}
              className="w-full py-2.5 cursor-pointer bg-[#1c4475] text-orange-400 font-semibold rounded-md hover:bg-[#0f2947] transition duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isButtonDisabled
                ? `Resend OTP in ${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`
                : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;
