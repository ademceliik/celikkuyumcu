/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UPLOADCARE_PUBLIC_KEY: string;
  readonly VITE_UPLOADCARE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
