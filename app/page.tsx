'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import { Loader2, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">TaskBoards</h1>
          <Loader2 className="w-8 h-8 text-purple-300 animate-spin mx-auto" />
          <p className="text-purple-200 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}