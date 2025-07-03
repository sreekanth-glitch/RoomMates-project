'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Email must contain @');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');
    try {
      const res = await fetch('https://room-mates-brown.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Register is OK');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        router.push(`/otp?email=${encodeURIComponent(email)}&from=register`);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="bg-gray-100 px-10 pt-30 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1c4475]">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full p-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Enter confirm Password"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 cursor-pointer bg-[#1c4475] text-orange-400 font-semibold rounded-md hover:bg-[#0f2947] transition duration-300 active:scale-95"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
