import { createClient } from '@supabase/supabase-js';

// Securely read from Vercel/Next.js Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize the Supabase client
// We use fallback placeholders to prevent the "supabaseUrl is required" error 
// if the environment variables are not set (e.g., in a demo environment).
// The dataFetcher logic checks for the actual env vars to toggle Demo Mode.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);