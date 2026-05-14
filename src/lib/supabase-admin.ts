import { createClient } from "@supabase/supabase-js";

let cachedClient: ReturnType<typeof createClient> | null = null;

function readEnvOrThrow(key: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key} environment variable`);
  }
  return value;
}

export function getSupabaseAdmin() {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = readEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceRoleKey = readEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");

  cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}

export function getBucketName() {
  return process.env.SUPABASE_BUCKET ?? "everwood-conversations";
}
