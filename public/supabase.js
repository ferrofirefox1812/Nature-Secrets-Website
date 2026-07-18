console.log("SUPABASE FILE LOADED");

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://pvxknkpkpwbgnjnrmskm.supabase.co";

const SUPABASE_KEY = "sb_publishable_kBADQWwnsVvkanTYrILiUw_83k1vR3Z";

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabaseClient;

console.log("Supabase connected", supabaseClient);

window.dispatchEvent(new Event("supabaseReady"));