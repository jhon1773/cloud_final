import { createClient } from "@supabase/supabase-js";

type LooseDb = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      }
    >;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let cachedClient: ReturnType<typeof createClient<LooseDb>> | null = null;

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

  cachedClient = createClient<LooseDb>(supabaseUrl, supabaseServiceRoleKey, {
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
