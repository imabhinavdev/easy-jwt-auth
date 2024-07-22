import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

// Define different configurations for development and production
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    input: 'index.js', // Adjusted path if necessary
    output: {
        dir: 'dist',
        format: 'es', // Output format: ES modules
        sourcemap: false, // Enable source maps only in development
    },
    plugins: [
        resolve(), // Resolve modules from node_modules
        commonjs(), // Convert CommonJS modules to ES6
        terser() // Minify the output in production
    ],
    treeshake: {
        moduleSideEffects: false // Enable tree shaking to remove unused code
    },
});
