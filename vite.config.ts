import { defineConfig, loadEnv } from 'vite';
import path from 'path';

// Vite config — frontend/ is the dev root; output goes to repo dist/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';

  return {
    root: 'frontend',
    base,
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
  };
});
