import { defineConfig } from 'vite';

export default defineConfig({
    base: '/', // Change to '/repo-name/' if deploying to username.github.io/repo-name
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        open: true,
        port: 3000
    }
});