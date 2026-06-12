/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity project id (heatmaps + session recordings) */
  readonly VITE_CLARITY_ID?: string;
  /** Cloudflare Web Analytics beacon token */
  readonly VITE_CF_BEACON_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
