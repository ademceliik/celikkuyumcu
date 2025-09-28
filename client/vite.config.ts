export default defineConfig({
  plugins: [react()],
  base: "/", // <<< burayı ekle
  resolve: {
    alias: {
      "@": path.resolve(import.meta.url, "src"), // import.meta.dirname yok, vite 3+ versiyonunda import.meta.url ile path.resolve kullan
      "@shared": path.resolve(import.meta.url, "../shared"),
    },
  },
  optimizeDeps: {
    include: ["@tanstack/react-query", "@tanstack/react-query-devtools"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
