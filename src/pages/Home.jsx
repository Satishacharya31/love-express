import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Home({ session }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518463892881-d587bf2c296a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20">
        <Header session={session} />
        
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Make Your Proposal Special
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Create a beautiful, memorable proposal for your loved one. Choose from our romantic templates and make your moment unforgettable.
          </p>
          
          <div className="flex gap-6 justify-center">
            {session ? (
              <>
                <Link
                  to="/create-proposal"
                  className="px-8 py-4 bg-rose-500 text-white rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors"
                >
                  Create Proposal
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-rose-500 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <button
                className="px-8 py-4 bg-rose-500 text-white rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Beautiful Templates</h3>
              <p>Choose from our collection of romantic proposal templates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Interactive</h3>
              <p>Create an engaging experience with animations and effects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Private Messages</h3>
              <p>Connect with your loved one through private messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}