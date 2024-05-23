const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outdir: 'out',
    platform: 'node',
    target: 'node14', // Adjust based on your target Node.js version
    external: ['vscode'],
    sourcemap: true, // Optional: for debugging
}).catch(() => process.exit(1));