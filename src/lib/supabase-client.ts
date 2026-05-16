import { createClient } from "@supabase/supabase-js";

// Create the Supabase client only in the browser to avoid server-side
// evaluation errors during Next.js build when env vars are not available.
let _supabase: ReturnType<typeof createClient> | null = null;
if (typeof window !== "undefined") {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
	_supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = (_supabase as ReturnType<typeof createClient>);
export default supabase;
