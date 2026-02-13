/**
 * Seed script – populates the guest_passwords table in Supabase.
 *
 * Run once:  npx tsx --env-file=.env.local scripts/seed-passwords.ts
 *
 * You can re-run safely; existing passwords are skipped (upsert with onConflict).
 *
 * NOTE: The tables must already exist in Supabase. Create them via the
 * Supabase Dashboard SQL Editor before running this script.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. Check your .env.local file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const guests = [
  // Family members
  { password: "maria2026", guest_group: "family", guest_name: "Maria" },

  // Friends
  { password: "sofia2026", guest_group: "friends", guest_name: "Sofia" },

  // Administrative
  { password: "knoxmyrtz2026", guest_group: "admin", guest_name: "Administrator G & M" },
];

async function main() {
  const { error } = await supabase
    .from("guest_passwords")
    .upsert(guests, { onConflict: "password", ignoreDuplicates: true });

  if (error) {
    throw error;
  }

  for (const guest of guests) {
    console.log(`  → ${guest.guest_name} (${guest.guest_group}): ${guest.password}`);
  }

  console.log(`\n✓ Seeded ${guests.length} guest passwords`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
