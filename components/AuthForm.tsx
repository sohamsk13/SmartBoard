'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Mail, Lock, User, Sparkles, ArrowRight, Shield, Zap, Play } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setIsLogin(true);
    setIsLoading(true);
    setError('');
    try {
      await login('demo@example.com', 'demo123');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A0118] via-[#1A0B2E] to-[#0A0118]" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            TaskBoards
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent animate-fade-in">
            Modern task management <br />
            <span className="inline-flex items-center">
              for productive teams
              <Sparkles className="w-8 h-8 ml-2 text-purple-400" />
            </span>
          </h1>
          <p className="text-xl text-purple-200/80 max-w-2xl">
            Collaborate, organize, and track work with the most intuitive task management platform designed for modern teams or personal use.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white">Lightning fast performance</span>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl filter blur-xl opacity-30 animate-pulse"></div>
          <Card className="bg-[#1A0B2E]/70 border-purple-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden hover:scale-[1.02] transition-transform">
            <CardHeader className="text-center pb-6 border-b border-purple-500/10 relative">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {isLogin ? 'Welcome back' : 'Get started'}
              </CardTitle>
              <CardDescription className="text-purple-200/80">
                {isLogin ? 'Sign in to continue to TaskBoards' : 'Create your account in seconds'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-4 h-4 text-purple-300" />
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-[#2A1B3E]/60 border-purple-500/10 text-white placeholder:text-purple-300/50 h-12"
                      required
                    />
                  </div>
                )}
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-300" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#2A1B3E]/60 border-purple-500/10 text-white placeholder:text-purple-300/50 h-12"
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-300" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#2A1B3E]/60 border-purple-500/10 text-white placeholder:text-purple-300/50 h-12"
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : isLogin ? 'Sign in' : 'Create account'}
                </Button>
              </form>

              {/* Demo User Button */}
              <Button
                type="button"
                onClick={handleDemoLogin}
                className="w-full mt-4 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Try Demo Account
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-purple-200/80 hover:text-purple-200 transition-colors text-sm"
                >
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <span className="ml-2 text-white font-medium underline decoration-purple-500/50 underline-offset-2">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
