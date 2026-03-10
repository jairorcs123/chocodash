import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createUser() {
  console.log('Creating admin2...');
  const { data, error } = await supabase.auth.signUp({
    email: 'admin3@chocodash.ec',
    password: 'chocopassword123',
    options: {
      data: {
        full_name: 'Admin Principal'
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error);
  } else {
    console.log('User created:', data.user?.id);
  }
}

createUser();
