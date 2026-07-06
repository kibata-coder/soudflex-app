import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://oklhftpwxqviutizrelp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGhmdHB3eHF2aXV0aXpyZWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MzU2NDIsImV4cCI6MjA4MzAxMTY0Mn0.G28L1teUN_4c09jyadEMMlaOxTRDWHd0oa9gnbAR8nw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
