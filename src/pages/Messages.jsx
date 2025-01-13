import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { supabase } from '../supabaseClient';

export default function Messages({ session }) {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && session) {
      fetchProposal();
    }
  }, [id, session]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProposal(data);
    } catch (err) {
      console.error('Error fetching proposal:', err);
    } finally {
      setLoading(false);
    }
  };

  const isParticipant = proposal && (
    session.user.id === proposal.proposer_id || 
    session.user.id === proposal.partner_id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
        <Header session={session} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <div className="animate-pulse text-2xl text-center text-gray-600">
              Loading conversation...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
        <Header session={session} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view this conversation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
      <Header session={session} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Messages</h2>
            <div className="text-gray-600">
              {session.user.id === proposal?.proposer_id ? (
                <span>Chatting with {proposal.partner_name}</span>
              ) : (
                <span>Chatting with {proposal.proposer_name}</span>
              )}
            </div>
          </div>
          <Chat session={session} proposalId={id} proposal={proposal} />
        </div>
      </div>
    </div>
  );
}