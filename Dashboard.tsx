import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Employee, SessionRecord } from '../types';
import { LogOut, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCompany, setUserCompany] = useState<string | number>('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Safely access company_id from user metadata
      if (user?.user_metadata?.company_id) {
        setUserCompany(user.user_metadata.company_id);
      } else {
        setUserCompany('Unknown');
      }

      // RLS Policy on Supabase will automatically filter these results
      // based on the auth.jwt() -> user_metadata -> company_id
      const { data: empData, error: empError } = await supabase
        .from('employee_manager')
        .select('*');

      if (empError) console.error('Error fetching employees:', empError);
      else setEmployees(empData || []);

      const { data: sessData, error: sessError } = await supabase
        .from('session_tracking')
        .select('*');
        
      if (sessError) console.error('Error fetching sessions:', sessError);
      else setSessions(sessData || []);

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F3F7]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#CCD9FF] border-t-[#466FF6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F3F7] text-slate-800">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-6">
              <img 
                src="https://res.cloudinary.com/djbo6r080/image/upload/v1764863780/Wordmark_Blue_16_aw7lvc.png" 
                alt="Boon Logo" 
                className="h-8" 
              />
              <div className="hidden md:flex flex-col border-l border-gray-200 pl-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Portal</span>
                  <span className="text-sm font-semibold text-[#466FF6]">
                    Company ID: {userCompany}
                  </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-full text-[#466FF6] bg-[#CCD9FF] bg-opacity-30 hover:bg-opacity-50 focus:outline-none transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#2E353D]">Overview</h1>
            <p className="text-gray-500 mt-2">Manage your team and view secure session logs.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Employee Manager Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 bg-[#466FF6] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Employee Manager</h3>
                    <p className="text-[#CCD9FF] text-xs font-medium opacity-90">employee_manager</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1">
              {employees.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 font-medium">No employees found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Dept</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {employees.map((emp, idx) => (
                        <tr key={emp.id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-[#2E353D]">{emp.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 rounded bg-[#F0F3F7] text-xs font-medium text-gray-600">
                                {emp.role}
                              </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Session Tracking Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 bg-[#FF8D80] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Activity className="w-6 h-6" />
                </div>
                 <div>
                    <h3 className="text-lg font-bold">Session Tracking</h3>
                    <p className="text-[#FFE5E0] text-xs font-medium opacity-90">session_tracking</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 font-medium">No session history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((sess, idx) => (
                    <div key={sess.id || idx} className="flex items-center p-4 bg-[#F0F3F7] rounded-2xl border border-transparent hover:border-[#CCD9FF] transition-all">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#2E353D]">{sess.action}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{new Date(sess.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-[#466FF6] shadow-sm">
                        User: {sess.user_id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;