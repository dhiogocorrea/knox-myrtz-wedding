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
  // friends
  { password: "4821laza2026", guest_group: "friends", guest_name: "Laza" },
  { password: "9302ori2026", guest_group: "friends", guest_name: "Ori" },
  { password: "1573vitor2026", guest_group: "friends", guest_name: "Vitor" },
  { password: "6048natalia2026", guest_group: "friends", guest_name: "Natalia" },
  { password: "7210dummy2026", guest_group: "friends", guest_name: "Dummy" },
  { password: "3956pedrin2026", guest_group: "friends", guest_name: "Pedrin" },
  { password: "8462cbm2026", guest_group: "friends", guest_name: "Cbm" },
  { password: "2107mama2026", guest_group: "friends", guest_name: "Mama" },
  { password: "5639degen2026", guest_group: "friends", guest_name: "Degen" },
  { password: "4785fig2026", guest_group: "friends", guest_name: "Fig" },
  { password: "8324lincoln2026", guest_group: "friends", guest_name: "Lincoln" },
  { password: "1095matthews2026", guest_group: "friends", guest_name: "Matthews" },
  { password: "2678luciana2026", guest_group: "friends", guest_name: "Luciana" },
  { password: "3841vitor_luciana2026", guest_group: "friends", guest_name: "Vitor (Luciana)" },
  { password: "5912izabela_alvarenga2026", guest_group: "friends", guest_name: "Izabela Alvarenga" },
  { password: "7530gabriel_alvarenga2026", guest_group: "friends", guest_name: "Gabriel Alvarenga" },
  { password: "4267ayla_alvarenga2026", guest_group: "friends", guest_name: "Ayla Alvarenga" },
  { password: "6189thais2026", guest_group: "friends", guest_name: "Thais" },
  { password: "2054natasha2026", guest_group: "friends", guest_name: "Natasha" },
  { password: "3476michalis2026", guest_group: "friends", guest_name: "Michalis" },
  { password: "8901arsenijs2026", guest_group: "friends", guest_name: "Arsenijs" },
  { password: "1342paco2026", guest_group: "friends", guest_name: "Paco" },
  { password: "9725isabel2026", guest_group: "friends", guest_name: "Isabel" },


  // family 

  
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
