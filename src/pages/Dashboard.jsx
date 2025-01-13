import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProposalCard from '../components/ProposalCard';
import { supabase } from '../supabaseClient';

export default function Dashboard({ session }) {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
  }, [session]);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .or(`proposer_id.eq.${session.user.id},partner_id.eq.${session.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return;
    }

    setProposals(data || []);
  };

  const deleteProposal = async (id) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)
      .eq('proposer_id', session.user.id);

    if (error) {
      console.error('Error deleting proposal:', error);
      alert('Failed to delete proposal');
    } else {
      fetchProposals();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
      <Header session={session} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Your Proposals</h2>
          <Link
            to="/create-proposal"
            className="px-6 py-3 bg-white text-rose-500 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Create New Proposal
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(proposal => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onDelete={deleteProposal}
              isProposer={proposal.proposer_id === session.user.id}
            />
          ))}
          {proposals.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white/80 rounded-lg">
              <p className="text-gray-600">No proposals yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}