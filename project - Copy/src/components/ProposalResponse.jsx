import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProposalResponse({ onAnswer }) {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 100);
    setNoButtonPosition({ x, y });
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={() => onAnswer('yes')}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xl font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all w-40"
        >
          Yes! 💖
        </button>
        <motion.button
          animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
          onHoverStart={moveNoButton}
          className="px-8 py-3 bg-gray-500 text-white rounded-full text-xl font-semibold hover:bg-gray-600 w-40"
        >
          No 😢
        </motion.button>
      </div>
    </div>
  );
}
