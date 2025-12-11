import React, { useEffect, useState } from 'react';
import { getDashboardSessions, getEmployeeRoster } from '../lib/dataFetcher';
import { SessionWithEmployee, Employee } from '../types';
import { 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';

const SessionDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionWithEmployee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Execute both fetches in parallel for performance
        const [sessionsData, rosterData] = await Promise.all([
          getDashboardSessions(),
          getEmployeeRoster()
        ]);
        
        setSessions(sessionsData);
        setEmployees(rosterData);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Logic
  const filteredSessions = sessions.filter(session => {
    const empName = `${session.employees?.first_name} ${session.employees?.last_name}`.toLowerCase();
    const program = session.employees?.program || 'Unknown';
    const matchesSearch = empName.includes(searchTerm.toLowerCase());
    const matchesFilter = filterProgram === 'All' || program === filterProgram;
    return matchesSearch && matchesFilter;
  });

  // Derived Stats
  const totalDuration = filteredSessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);
  const uniqueEmployees = new Set(filteredSessions.map(s => s.employee_id)).size;
  // Extract unique programs from the employee roster for the filter dropdown
  const programs = ['All', ...Array.from(new Set(employees.map(e => e.program).filter(Boolean)))];

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Session Tracking</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Connected to Supabase PostgreSQL
          </p>
        </div>
        
        {/* Environment Warning for Demo */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL) && (
           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
             Demo Mode (Using Mock Data)
           </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sessions" 
          value={filteredSessions.length} 
          icon={<Calendar className="w-6 h-6 text-blue-600" />} 
        />
        <StatCard 
          title="Active Employees" 
          value={uniqueEmployees} 
          icon={<Users className="w-6 h-6 text-emerald-600" />} 
        />
        <StatCard 
          title="Total Duration" 
          value={`${Math.round(totalDuration / 60)} hrs`} 
          subValue={`${totalDuration} minutes`}
          icon={<Clock className="w-6 h-6 text-purple-600" />} 
        />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by employee name..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            className="w-full md:w-48 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
          >
            {programs.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Employee</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Program</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Duration</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Notes</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {new Date(session.session_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs overflow-hidden">
                          {session.employees?.avatar_url ? (
                            <img src={session.employees.avatar_url} alt="" className="w-full h-full object-cover"/>
                          ) : (
                            <span>{session.employees?.first_name?.[0]}{session.employees?.last_name?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.employees?.first_name} {session.employees?.last_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {session.employees?.program || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {session.duration_minutes} min
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={session.notes}>
                      {session.notes}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-blue-600 transition">
                         <ArrowRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No sessions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple Stat Card Helper
const StatCard = ({ title, value, subValue, icon }: { title: string, value: string | number, subValue?: string, icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

export default SessionDashboard;