export interface Employee {
  id: number | string;
  first_name: string;
  last_name: string;
  program: string;
  company_details?: string;
  email?: string;
  avatar_url?: string;
}

export interface Session {
  id: number | string;
  created_at: string;
  session_date: string;
  duration_minutes: number;
  notes: string;
  employee_id: number | string;
}

// Joined Type
export interface SessionWithEmployee extends Session {
  employees: {
    first_name: string;
    last_name: string;
    program: string;
    avatar_url?: string;
  } | null; // Join might return null if constraint isn't perfect, though inner join implies existence
}
