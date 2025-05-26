import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your own Supabase project URL and anon key
const supabaseUrl = 'https://lgbsdoxrklqzysdakdoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYnNkb3hya2xxenlzZGFrZG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDU3OTIsImV4cCI6MjA2MzMyMTc5Mn0.YalzI743VNpGQrgucv8KSywAupn1dZ9xf_gOstWiV60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 