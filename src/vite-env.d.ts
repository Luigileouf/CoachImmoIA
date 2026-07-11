/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LLM_PROVIDER?: "mistral" | "google";
  readonly VITE_MISTRAL_MODEL?: string;
  readonly VITE_GEMMA_MODEL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
