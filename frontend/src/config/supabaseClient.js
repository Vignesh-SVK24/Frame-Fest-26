import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rmeiqhpubvmkvivuasvm.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_G2dT1ViN37Vy1SqP3HIgEw_wrnjSJk8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
