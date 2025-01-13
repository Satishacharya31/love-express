import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProposalTemplates from '../components/ProposalTemplates';
import { supabase } from '../supabaseClient';

export default function CreateProposal({ session }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('template');
  const [template, setTemplate] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleTemplateSelect = (selectedTemplate) => {
    setTemplate(selectedTemplate);
    setStep('details');
  };

  const createProposal = async () => {
    if (!partnerName.trim() || !template) return;

    const { data, error } = await supabase
      .from('proposals')
      .insert([{
        proposer_id: session.user.id,
        partner_name: partnerName,
        status: 'pending',
        template_id: template.id,
        template_data: {
          name: template.name,
          steps: template.steps,
          theme: template.theme
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      return;
    }

    const proposalLink = `${window.location.origin}/proposal/${data.id}`;
    setShareLink(proposalLink);
    setStep('share');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
      <Header session={session} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Create Your Proposal</h2>
          
          {step === 'template' && (
            <div className="space-y-6">
              <h3 className="text-xl text-center mb-8">Choose a Proposal Template</h3>
              <ProposalTemplates onSelect={handleTemplateSelect} />
            </div>
          )}

          {step === 'details' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Partner's Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter your partner's name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep('template')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={createProposal}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          )}

          {step === 'share' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Your Proposal is Ready!</h3>
                <p className="text-gray-600 mb-6">Share this unique link with your partner:</p>
                <div className="flex gap-2 mb-8">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:from-rose-600 hover:to-pink-600"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}