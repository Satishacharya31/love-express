import React, { useState } from 'react';
import CustomProposalCreator from './CustomProposalCreator';

const templates = [
  {
    id: 'romantic',
    name: 'Romantic',
    steps: [
      "Hey beautiful! 💖",
      "Every moment with you is magical...",
      "You're the one I want to spend forever with...",
      "Will you marry me? 💍"
    ],
    theme: 'from-rose-500 to-pink-500'
  },
  {
    id: 'playful',
    name: 'Playful',
    steps: [
      "Hey there cutie! 🎮",
      "Wanna play a game?",
      "The prize is pretty awesome...",
      "Game over: Will you marry me? 💍"
    ],
    theme: 'from-purple-500 to-blue-500'
  },
  {
    id: 'classic',
    name: 'Classic',
    steps: [
      "My dearest...",
      "You mean everything to me",
      "I can't imagine life without you",
      "Will you marry me? 💍"
    ],
    theme: 'from-amber-500 to-red-500'
  },
  {
    id: 'custom',
    name: 'Custom',
    steps: [],
    theme: 'from-emerald-500 to-teal-500'
  }
];

export default function ProposalTemplates({ onSelect }) {
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (showCustomForm) {
    return (
      <CustomProposalCreator
        onSubmit={onSelect}
        onBack={() => setShowCustomForm(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => template.id === 'custom' ? setShowCustomForm(true) : onSelect(template)}
          className="bg-white/90 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold mb-4">{template.name}</h3>
          <div className={`h-2 rounded-full bg-gradient-to-r ${template.theme} mb-4`} />
          {template.id === 'custom' ? (
            <p className="text-gray-600">Create your own custom proposal messages with optional background images</p>
          ) : (
            <div className="space-y-2 text-sm text-gray-600">
              {template.steps.map((step, index) => (
                <p key={index} className="truncate">{step}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}