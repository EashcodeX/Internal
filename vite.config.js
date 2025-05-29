import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    root: 'prasana',
    base: '/INTERNAL/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './prasana/src')
        }
    },
    server: {
        watch: {
            usePolling: true
        }
    }
});
