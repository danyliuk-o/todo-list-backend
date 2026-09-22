import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — fill them in in .env (see .env.example)."
  );
}

// service_role key: only ever used server-side, bypasses Row Level Security.
// Never expose this client's config to the frontend.
export const supabase = createClient(supabaseUrl, supabaseKey);
