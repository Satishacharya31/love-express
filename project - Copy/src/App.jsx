import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import AuthForm from './components/AuthForm';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateProposal from './pages/CreateProposal';
import Proposal from './pages/Proposal';
import Messages from './pages/Messages';
import MessagesOverview from './pages/MessagesOverview';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!session && window.location.pathname !== '/') {
      return (
        <div className="min-h-screen bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            <AuthForm />
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard session={session} /></ProtectedRoute>} />
        <Route path="/create-proposal" element={<ProtectedRoute><CreateProposal session={session} /></ProtectedRoute>} />
        <Route path="/proposal/:id" element={<ProtectedRoute><Proposal session={session} /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesOverview session={session} /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><Messages session={session} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}