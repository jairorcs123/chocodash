import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('Testing login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@chocodash.ec',
    password: 'chocopassword123'
  });

  if (error) {
    console.error('Login error:', error);
  } else {
    console.log('Login success! User ID:', data.user?.id);
  }
}

testLogin();
