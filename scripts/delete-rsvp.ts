import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);



async function deleteRsvpByField(field: 'email' | 'guest_name', value: string) {
  const { data, error } = await supabase
    .from('rsvp_submissions')
    .select('id, password, guest_name, email')
    .eq(field, value);

  if (error) {
    console.error(`Error fetching RSVPs by ${field}:`, error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(`No RSVP entries found for ${field} = ${value}`);
    return;
  }

  for (const row of data) {
    const { error: delError } = await supabase
      .from('rsvp_submissions')
      .delete()
      .eq('id', row.id);
    if (delError) {
      console.error(`Error deleting RSVP id ${row.id}:`, delError);
    } else {
      console.log(`Deleted RSVP: id=${row.id}, email=${row.email}, password=${row.password}, guest_name=${row.guest_name}`);
    }
  }
}

async function deleteRsvpById(id: number) {
  const { error } = await supabase
    .from('rsvp_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting RSVP:', error);
    process.exit(1);
  } else {
    console.log('RSVP deleted successfully for id', id);
  }
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npx ts-node scripts/delete-rsvp.ts <email|id>');
  process.exit(1);
}

const maybeId = Number(arg);
if (!isNaN(maybeId)) {
  deleteRsvpById(maybeId);
} else {
  // Try deleting by email first
  deleteRsvpByField('email', arg).then(() => {
    // Also try deleting by guest_name in case the user passed a name
    deleteRsvpByField('guest_name', arg);
  });
}