#!/usr/bin/env node

import esbuild from 'esbuild';

esbuild
  .build({
    watch: true,
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    platform: 'node',
    target: 'esnext',
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: './dist/index.js',
  })
  .catch(() => process.exit(1));
