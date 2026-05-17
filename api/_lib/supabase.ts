import { createClient } from "@supabase/supabase-js";

function readRuntimeEnv() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
  };
}

export function getSupabaseRuntimeConfig() {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } = readRuntimeEnv();

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceRoleKey,
    isConfigured: Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)),
  };
}

export function createSupabaseServerClient() {
  const runtime = getSupabaseRuntimeConfig();

  if (!runtime.url || !runtime.serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant. Configurez les variables d'environnement pour activer la base reelle.",
    );
  }

  return createClient(runtime.url, runtime.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
