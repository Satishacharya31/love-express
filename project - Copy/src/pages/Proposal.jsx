import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { supabase } from '../supabaseClient';
import ProposalLoader from '../components/ProposalLoader';
import ProposalStep from '../components/ProposalStep';
import ProposalResponse from '../components/ProposalResponse';
import ProposalBackground from '../components/ProposalBackground';

export default function Proposal({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const handleProposalLoaded = data => {
    setProposal(data);
  };

  const handleError = errorMessage => {
    setError(errorMessage);
  };

  const handleAnswer = async response => {
    try {
      if (!session) {
        alert('Please log in to respond to this proposal');
        return;
      }

      setAnswer(response);
      if (response === 'yes') {
        await saveResponse(response);
        setShowConfetti(true); 
        setTimeout(() => setShowChat(true), 3000);
        document.title = 'She Said YES! 💍';
      }
    } catch (err) {
      console.error('Error handling answer:', err);
      setAnswer(null);
      setShowConfetti(false);
      alert('There was an error saving your response. Please try again.');
    }
  };

  const saveResponse = async (response) => {
    if (!session || !id) return;

    const { error: updateError } = await supabase
      .from("proposals")
      .update({
        status: response === "yes" ? "accepted" : "rejected",
        partner_id: session.user.id,
      })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    const { error: msgError } = await supabase
      .from("messages")
      .insert([
        {
          content:
            response === "yes"
              ? "I said YES! I love you! 💖"
              : "I need more time to think about it... 💭",
          user_id: session.user.id,
          proposal_id: id,
        },
      ]);

    if (msgError) {
      console.error("Error sending message:", msgError);
    }
  };

  const proposalSteps = proposal?.template_data?.steps || ["Loading proposal..."];
  const backgrounds = proposal?.template_data?.backgrounds || [];
  const currentBackground =
    backgrounds[step] ||
    "https://images.unsplash.com/photo-1518463892881-d57999199596?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80";

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchProposal = async () => {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error; 
        if (!data) throw new Error('Proposal not found');

        setProposal(data);
      } catch (error) {
        console.error('Error loading proposal:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  return (
    <div className="min-h-screen relative">
      {loading && (
          <ProposalLoader><>
          <ProposalBackground currentBackground={currentBackground} />
          <div className="relative z-20">
            <Header session={session} />
            <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
              {showConfetti && (
                <Confetti
                  recycle={false}
                  numberOfPieces={2000}
                  colors={['#FFD700', '#FF69B4', '#FFB6C1', '#FFC0CB']}
                />
              )}
              {!showChat && (
                <div
                  className="w-full max-w-2xl transition-opacity duration-500"
                  style={{ display: showChat ? 'none' : 'flex' }}
                >
                  <AnimatePresence mode="wait">
                    {step < proposalSteps.length - 1 ? (
                      <ProposalStep
                        key={step}
                        step={step}
                        proposalSteps={proposalSteps}
                        onContinue={() => setStep(step + 1)}
                      />
                    ) : (
                      <ProposalResponse onAnswer={handleAnswer} />
                    )}
                  </AnimatePresence>
                </div>
              )}

              {showChat && (
                <Chat
                  session={session}
                  proposalId={id}
                  proposal={proposal}
                  show={showChat}
                />
              )}
            </div>
          </div>
        </></ProposalLoader>
      )}

      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-lg">
          <div className="p-8 rounded-lg bg-red-100 text-red-800">
            <h2 className="text-xl font-semibold mb-2">Oops, something went wrong!</h2>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!error && proposal && (
        <>
          <ProposalBackground currentBackground={currentBackground} />
          <div className="relative z-20">
            <Header session={session} />
            <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
              {showConfetti && (
                <Confetti
                  recycle={false}
                  numberOfPieces={2000}
                  colors={['#FFD700', '#FF69B4', '#FFB6C1', '#FFC0CB']}
                />
              )}
              {!showChat && (
                <div
                  className="w-full max-w-2xl transition-opacity duration-500"
                  style={{ display: showChat ? 'none' : 'flex' }}
                >
                  <AnimatePresence mode="wait">
                    {step < proposalSteps.length - 1 ? (
                      <ProposalStep
                        key={step}
                        step={step}
                        proposalSteps={proposalSteps}
                        onContinue={() => setStep(step + 1)}
                      />
                    ) : (
                      <ProposalResponse onAnswer={handleAnswer} />
                    )}
                  </AnimatePresence>
                </div>
              )}

              {showChat && (
                <Chat
                  session={session}
                  proposalId={id}
                  proposal={proposal}
                  show={showChat}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
