/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Override opcional do projeto do Microsoft Clarity (default no código) */
  readonly VITE_CLARITY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
