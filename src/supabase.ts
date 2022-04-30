import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const supabaseBucket = supabase.storage.from("repo-test");

export default supabaseBucket;
