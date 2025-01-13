import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';

export default function MessagesOverview({ session }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          messages:messages(
            id,
            created_at
          )
        `)
        .or(`proposer_id.eq.${session.user.id},partner_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter to show only proposals with messages
      const conversationsWithMessages = data.filter(proposal => 
        proposal.messages && proposal.messages.length > 0
      );

      setConversations(conversationsWithMessages || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
        <Header session={session} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500">
      <Header session={session} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Your Conversations</h2>
        <div className="space-y-4">
          {conversations.map(conversation => (
            <Link
              key={conversation.id}
              to={`/messages/${conversation.id}`}
              className="block bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    {session.user.id === conversation.proposer_id 
                      ? `Chat with ${conversation.partner_name}`
                      : "Chat with Proposer"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {conversation.messages?.length} messages • Last message {' '}
                    {new Date(conversation.messages[conversation.messages.length - 1]?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-rose-500">View Messages →</span>
              </div>
            </Link>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-12 bg-white/80 rounded-lg">
              <p className="text-gray-600">No conversations yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Messages will appear here once you start chatting in a proposal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}