import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteRsvp(email: string) {
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('email', email);

  if (error) {
    console.error('Error deleting RSVP:', error);
    process.exit(1);
  } else {
    console.log('RSVP deleted successfully for', email);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx ts-node scripts/delete-rsvp.ts <email>');
  process.exit(1);
}

deleteRsvp(email);