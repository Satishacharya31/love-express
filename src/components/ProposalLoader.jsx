import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProposalLoader({ session, onProposalLoaded, onError }) {
  const { id } = useParams();
  const [loadingAnimation, setLoadingAnimation] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Proposal not found');
      } catch (error) {
        console.error('Error loading proposal:', error);
        onError(error.message);
      }
    };

    fetchProposal();
  }, [id, onError]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className={`text-gray-600 ${loadingAnimation ? 'heart-beat' : ''} custom-emoji-size`}>
          <p style={{ fontSize: '150px' }}>💗</p>
        </div>
      </div>
    </div>
  );
}
