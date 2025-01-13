import React, { useState } from 'react';

export default function CustomProposalCreator({ onSubmit, onBack }) {
  const [steps, setSteps] = useState([{ message: '', backgroundImage: '' }]);

  const addStep = () => {
    setSteps([...steps, { message: '', backgroundImage: '' }]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = () => {
    const filteredSteps = steps.filter(step => step.message.trim() !== '');
    if (filteredSteps.length < 1) {
      alert('Please add at least one message for your proposal');
      return;
    }

    const customTemplate = {
      id: 'custom',
      name: 'Custom',
      steps: filteredSteps.map(step => step.message),
      backgrounds: filteredSteps.map(step => step.backgroundImage || ''),
      theme: 'from-emerald-500 to-teal-500'
    };
    
    onSubmit(customTemplate);
  };

  return (
    <div className="bg-white/90 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Create Your Custom Proposal</h3>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Message {index + 1}</h4>
              {steps.length > 1 && (
                <button
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Text
                </label>
                <textarea
                  value={step.message}
                  onChange={(e) => updateStep(index, 'message', e.target.value)}
                  placeholder="Enter your message"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={step.backgroundImage}
                  onChange={(e) => updateStep(index, 'backgroundImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500"
                />
                {step.backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={step.backgroundImage}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1518463892881-d587bf2c296a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80';
                        alert('Invalid image URL. Using default background.');
                        updateStep(index, 'backgroundImage', '');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addStep}
          className="w-full py-3 border-2 border-dashed border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          + Add Another Message
        </button>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600"
          >
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  );
}