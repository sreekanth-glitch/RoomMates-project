'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { MdDashboard } from 'react-icons/md';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="bg-[#1c4475] shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/final logo.png"
              alt="RoomMate logo"
              width={200}
              height={200}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="space-x-8 mr-65">
              <Link href="/" className={`text-lg ${pathname === '/' ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>Home</Link>
              <Link href="/about" className={`text-lg ${pathname.startsWith('/about') ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>About</Link>
              <Link href="/contact" className={`text-lg ${pathname.startsWith('/contact') ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>Contact</Link>
            </div>

            <div className="flex gap-2">
              {hasMounted && isLoggedIn ? (
                <>
                  <Link href="/room">
                    <button
                      className="bg-green-500 cursor-pointer text-white p-2 rounded-full hover:bg-green-600 transition duration-200"
                      title="Dashboard"
                    >
                      <MdDashboard size={24} />
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <button className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200 active:scale-95">Register</button>
                  </Link>
                  <Link href="/login">
                    <button className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200 active:scale-95">Login</button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer rounded-md p-1 text-white hover:bg-orange-400 focus:outline-none focus:ring-2 ring-orange-400"
            >
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`mt-1 block h-0.5 w-6 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`mt-1 block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <nav className="mt-4 flex flex-col items-center space-y-4 md:hidden">
            <Link href="/" onClick={() => setOpen(false)} className={`text-lg ${pathname === '/' ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>Home</Link>
            <Link href="/about" onClick={() => setOpen(false)} className={`text-lg ${pathname.startsWith('/about') ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className={`text-lg ${pathname.startsWith('/contact') ? 'text-orange-400' : 'text-white'} hover:text-orange-400`}>Contact</Link>

            <div className="flex gap-2">
              {hasMounted && isLoggedIn ? (
                <>
                  <Link href="/room" onClick={() => setOpen(false)}>
                    <button
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-200"
                      title="Dashboard"
                    >
                      <MdDashboard size={24} />
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200 active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <button className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200 active:scale-95">Register</button>
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <button className="bg-orange-400 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-orange-500 transition duration-200 active:scale-95">Login</button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
