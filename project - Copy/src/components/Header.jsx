import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Header({ session }) {
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const name =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        session.user.email?.split("@")[0];
      setUserName(name);
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-rose-600">
            Proposal App
          </Link>
        </div>
        {session ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            >
              {session.user.identities?.some(id => id.provider === 'google') ? (
                <img
                  src={session.user.user_metadata?.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold"
                  style={{ backgroundColor: session.user.user_metadata?.color || getRandomColor() }}
                >
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/messages"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Messages
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
