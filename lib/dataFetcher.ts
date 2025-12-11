import { supabase } from './supabaseClient';
import { MOCK_EMPLOYEES, MOCK_SESSIONS } from '../constants';
import { Employee, SessionWithEmployee } from '../types';

// Helper to check if we are in a demo environment (missing keys)
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Fetches all rows from the employees table.
 */
export const getEmployeeRoster = async (): Promise<Employee[]> => {
  if (isDemoMode) {
    console.warn('Supabase keys missing. Returning MOCK data for Employees.');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_EMPLOYEES;
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*');

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  return data as Employee[];
};

/**
 * Fetches all session data including joined employee details.
 * Uses PostgreSQL inner JOIN syntax via Supabase.
 */
export const getDashboardSessions = async (): Promise<SessionWithEmployee[]> => {
  if (isDemoMode) {
    console.warn('Supabase keys missing. Returning MOCK data for Sessions.');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    return MOCK_SESSIONS;
  }

  // The syntax `employees!inner` enforces a PostgreSQL INNER JOIN.
  // We select '*' from sessions and specific columns from the related employees table.
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      employees!inner (
        first_name,
        last_name,
        program
      )
    `)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching dashboard sessions:', error);
    throw error;
  }

  // Supabase returns the joined data nested under the table name key
  return data as unknown as SessionWithEmployee[];
};