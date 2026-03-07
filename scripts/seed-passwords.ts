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
// Prefer service role key when present (required for deletes/bypass RLS).
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
  { password: "8936stephen2026", guest_group: "friends", guest_name: "Stephen" },
  { password: "8800ben2026", guest_group: "friends", guest_name: "Ben" },
  { password: "7037haris2026", guest_group: "friends", guest_name: "Haris" },
  { password: "9168marios2026", guest_group: "friends", guest_name: "Marios" },
  { password: "8693skna2026", guest_group: "friends", guest_name: "Skna" },
  { password: "1520ermis2026", guest_group: "friends", guest_name: "Ermis" },
  { password: "8789psarakis2026", guest_group: "friends", guest_name: "Psarakis" },
  { password: "9451konstantina_athinaiou2026", guest_group: "friends", guest_name: "Konstantina Athinaiou" },
  { password: "7315afroditi2026", guest_group: "friends", guest_name: "Afroditi" },
  { password: "7073nancy2026", guest_group: "friends", guest_name: "Nancy" },
  { password: "8224maria_inka2026", guest_group: "friends", guest_name: "Maria (Inka)" },
  { password: "4239foteini2026", guest_group: "friends", guest_name: "Foteini" },
  { password: "4382thomas2026", guest_group: "friends", guest_name: "Thomas" },
  { password: "8367iasonas2026", guest_group: "friends", guest_name: "Iasonas" },
  { password: "2930emmanuela2026", guest_group: "friends", guest_name: "Emmanuela" },
  { password: "6602dardavesis2026", guest_group: "friends", guest_name: "Dardavesis" },
  { password: "2717teo2026", guest_group: "friends", guest_name: "Teo" },
  { password: "4211john2026", guest_group: "friends", guest_name: "John" },
  { password: "9920bill2026", guest_group: "friends", guest_name: "Bill" },
  { password: "6466themis2026", guest_group: "friends", guest_name: "Themis" },
  { password: "5739marilena2026", guest_group: "friends", guest_name: "Marilena" },
  { password: "7027manolis_chrys2026", guest_group: "friends", guest_name: "Manolis Chrys" },
  { password: "5535georgia_tsiam2026", guest_group: "friends", guest_name: "Georgia Tsiam" },
  { password: "7773takis_and_labrini2026", guest_group: "friends", guest_name: "Takis and Labrini" },
  { password: "2206nona_argyro2026", guest_group: "friends", guest_name: "Nona Argyro" },
  { password: "2364nona_bety2026", guest_group: "friends", guest_name: "Nona Bety" },
  { password: "4723nonos_tolis2026", guest_group: "friends", guest_name: "Nonos Tolis" },
  { password: "5666grigoris2026", guest_group: "friends", guest_name: "Grigoris" },
  { password: "8044petros2026", guest_group: "friends", guest_name: "Petros" },
  { password: "2212astrit2026", guest_group: "friends", guest_name: "Astrit" },
  { password: "4119kylertzis2026", guest_group: "friends", guest_name: "Kylertzis" },
  { password: "2627ioanna_chouliar2026", guest_group: "friends", guest_name: "Ioanna Chouliar" },
  { password: "1367anastasis2026", guest_group: "friends", guest_name: "Anastasis" },
  { password: "3488dimitris_manitaras2026", guest_group: "friends", guest_name: "Dimitris Manitaras" },
  { password: "1779loukidis2026", guest_group: "friends", guest_name: "Loukidis" },
  { password: "1312freegaza2026", guest_group: "friends", guest_name: "Abood"},

  // family 

  { password: "1958katia2026", guest_group: "family", guest_name: "Katia Alvarenga" },
  { password: "2679tio_jr2026", guest_group: "family", guest_name: "Tio Jr" },
  { password: "8990andrea2026", guest_group: "family", guest_name: "Andrea" },
  { password: "3480posei2026", guest_group: "family", guest_name: "Posei" },
  { password: "9754mama2026", guest_group: "family", guest_name: "Mama" },
  { password: "3051vasilis2026", guest_group: "family", guest_name: "Vasilis" },
  { password: "3078theia_maria2026", guest_group: "family", guest_name: "Theia Maria" },
  { password: "8117theios_sotiris2026", guest_group: "family", guest_name: "Theios Sotiris" },
  { password: "4245christina_z2026", guest_group: "family", guest_name: "Christina Z" },
  
  // Administrative
  { password: "knoxmyrtz2026", guest_group: "admin", guest_name: "Administrator G & M" },
];

async function main() {
  const replace = process.env.SEED_REPLACE === "true";

  if (replace) {
    console.log("SEED_REPLACE=true — clearing existing guest_passwords table before seeding...");
    const { error: delError } = await supabase.from("guest_passwords").delete().neq("password", "");
    if (delError) {
      throw delError;
    }
    // insert fresh set
    const { error: insertError } = await supabase.from("guest_passwords").insert(guests);
    if (insertError) throw insertError;
  } else {
    // default safe behavior: upsert and skip existing duplicates
    const { error } = await supabase
      .from("guest_passwords")
      .upsert(guests, { onConflict: "password", ignoreDuplicates: true });

    if (error) {
      throw error;
    }
  }

  for (const guest of guests) {
    console.log(`  → ${guest.guest_name} (${guest.guest_group}): ${guest.password}`);
  }

  console.log(`\n✓ Seeded ${guests.length} guest passwords (replace=${replace})`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
