import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        //alias: [
        //    { find: '@', replacement: path.resolve(__dirname, './src') },
        //]
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/shared/components'),
        }
    }
})
