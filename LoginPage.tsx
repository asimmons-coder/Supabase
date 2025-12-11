import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F7] flex items-center justify-center p-4 font-['Barlow']">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header Section with Brand Color - Using Boon Blue */}
        <div className="bg-[#466FF6] p-8 text-center relative overflow-hidden">
            {/* Decorative blobs based on brand guidelines */}
            <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-[#365ABD] rounded-full opacity-20"></div>
            <div className="absolute bottom-[-10px] right-[-10px] w-16 h-16 bg-[#CCD9FF] rounded-full opacity-20"></div>
            
            {/* Logo with filter to ensure high contrast (white) on blue background */}
            <img 
              src="https://res.cloudinary.com/djbo6r080/image/upload/v1764863780/Wordmark_Blue_16_aw7lvc.png" 
              alt="Boon Logo" 
              className="h-10 mx-auto mb-4 brightness-0 invert" 
            />
            <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
            <p className="text-[#CCD9FF] mt-2 font-medium">Portal Access</p>
        </div>

        <div className="p-8 pt-10">
          {error && (
            <div className="mb-6 p-4 bg-[#FF8D80] bg-opacity-10 border border-[#FF8D80] rounded-2xl flex items-start gap-3 text-[#E65040] text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#466FF6]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-[#F0F3F7] border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#466FF6] transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#466FF6]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-[#F0F3F7] border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#466FF6] transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-[#466FF6] hover:bg-[#365ABD] focus:outline-none focus:ring-4 focus:ring-[#CCD9FF] disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4 group"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <p className="text-gray-400 text-sm">Secured by Supabase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;