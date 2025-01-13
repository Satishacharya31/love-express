import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Chat({ session, proposalId, proposal }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    if (session && proposalId) {
      fetchMessages();
      const channel = supabase
        .channel(`proposal:${proposalId}`)
        .on('postgres_changes', {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'messages',
          filter: `proposal_id=eq.${proposalId}`
        }, payload => {
          if (payload.eventType === 'INSERT') {
            setMessages(current => [...current, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(current => current.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(current =>
              current.map(msg => msg.id === payload.new.id ? payload.new : msg)
            );
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, proposalId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching messages:', error);
    else setMessages(data || []);
  };

  const sendMessage = async (content) => {
    if (!content.trim() || !session || !proposalId) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        content,
        user_id: session.user.id,
        proposal_id: proposalId
      }]);

    if (error) console.error('Error sending message:', error);
    else {
      setNewMessage('');
      fetchMessages();
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const updateMessage = async (messageId, newContent) => {
    const { error } = await supabase
      .from('messages')
      .update({ content: newContent })
      .eq('id', messageId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message');
    } else {
      setEditingMessage(null);
    }
  };

  const isProposer = session.user.id === proposal?.proposer_id;
  const isPartner = session.user.id === proposal?.partner_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8 flex-col ">
          <h2 className="text-3xl font-bold">Messages</h2>
          <div className="text-gray-600">
            <div className="space-y-6 w-full min-h-[60vh] mx-h-[100%]">
              <div className=" min-h-[60vh] mx-h-[100%] overflow-y-auto p-4 bg-white/50 rounded-lg flex flex-col justify-end">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 ${msg.user_id === session.user.id ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${msg.user_id === session.user.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      {editingMessage === msg.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={msg.content}
                            onChange={(e) => {
                              setMessages(messages.map(m =>
                                m.id === msg.id ? { ...m, content: e.target.value } : m
                              ));
                            }}
                            className="px-2 py-1 rounded text-black"
                          />
                          <button
                            onClick={() => updateMessage(msg.id, msg.content)}
                            className="text-sm bg-green-500 px-2 py-1 rounded text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMessage(null)}
                            className="text-sm bg-gray-500 px-2 py-1 rounded text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className='h-[100%]'>{msg.content}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {(isProposer || isPartner) && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-pink-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage(newMessage);
                      }
                    }}
                  />
                  <button
                    onClick={() => sendMessage(newMessage)}
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}