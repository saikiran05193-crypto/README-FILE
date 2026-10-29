import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, AlertTriangle, Key, CheckCircle, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onClose?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-cyan-950/50 text-slate-100 relative overflow-hidden">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-3 text-cyan-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">System Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">Environmental Intelligence Network Access</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              User Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@environmental.net"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-cyan-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Sign In to Control Room</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Credentials */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
            Quick Demo Login Shortcuts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillQuickLogin('admin@environmental.net')}
              className="py-1.5 px-2 bg-slate-800/60 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 rounded text-[11px] text-cyan-300 transition-colors cursor-pointer text-center"
            >
              👑 Admin
            </button>
            <button
              onClick={() => fillQuickLogin('operator@environmental.net')}
              className="py-1.5 px-2 bg-slate-800/60 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-500/40 rounded text-[11px] text-blue-300 transition-colors cursor-pointer text-center"
            >
              🛠️ Operator
            </button>
            <button
              onClick={() => fillQuickLogin('viewer@environmental.net')}
              className="py-1.5 px-2 bg-slate-800/60 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded text-[11px] text-slate-300 transition-colors cursor-pointer text-center"
            >
              👁️ Viewer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
