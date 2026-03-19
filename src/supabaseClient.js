import { createClient } from "@supabase/supabase-js";

// --- REPLACE THESE VALUES WITH YOUR OWN ---
const SUPABASE_URL = "https://meqemevrpjwuzlosxurv.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_SUrwezt0tBrWmSoiAJh1Wg_3oVb95yr";
// ------------------------------------------

/**
 * Supabase Client Instance
 * Use this to interact with your Supabase database.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
