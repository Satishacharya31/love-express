import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export default function ProposalStep({ step, proposalSteps, onContinue }) {
  return (
    <motion.div
      key={step}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center"
    >
      <TypeAnimation
        sequence={[proposalSteps[step]]}
        wrapper="h2"
        cursor={true}
        className="text-3xl font-bold mb-8"
      />
      {step < proposalSteps.length - 1 && (
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xl font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all"
        >
          Continue
        </button>
      )}
    </motion.div>
  );
}
