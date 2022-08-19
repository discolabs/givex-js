import path from 'path';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      formats: ['es', 'iife', 'umd'],
      name: 'Givex',
      fileName: (format) => format === 'iife' ? 'givex.js' : `givex.${format}.js`
    }
  },
  plugins: []
});
