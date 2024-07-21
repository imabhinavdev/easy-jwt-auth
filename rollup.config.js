import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'index.js', // Entry file
    output: {
        dir: 'dist', // Output directory
        // file: 'dist/bundle.js', // Output file
        format: 'es', // Output format: ES modules
        sourcemap: true, // Generate source maps
    },
    plugins: [
        resolve(), // Resolve modules from node_modules
        commonjs(), // Convert CommonJS modules to ES6
    ],
};
