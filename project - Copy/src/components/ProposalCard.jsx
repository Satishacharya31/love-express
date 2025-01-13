import React from 'react';
import { Link } from 'react-router-dom';

export default function ProposalCard({ proposal, onDelete, isProposer }) {
  return (
    <div className="bg-white/90 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Proposal for {proposal.partner_name}
          </h3>
          <p className="text-sm text-gray-500">
            Created {new Date(proposal.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
          proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </span>
      </div>
      <div className="flex justify-end space-x-3">
        <Link
          to={`/proposal/${proposal.id}`}
          className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 text-sm"
        >
          View Proposal
        </Link>
        <Link
          to={`/messages/${proposal.id}`}
          className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-sm"
        >
          Messages
        </Link>
        {isProposer && proposal.status === 'pending' && (
          <button
            onClick={() => onDelete(proposal.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}