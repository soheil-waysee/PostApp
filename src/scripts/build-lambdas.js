"use strict";

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const LAMBDA_GLOB = 'src/api/lambda/**/*.ts';

(async function () {
  const { globby } = await import('globby'); // dynamic import here

  const entryFiles = await globby(LAMBDA_GLOB);
  const outBaseDir = 'dist';

  for (const entry of entryFiles) {
    const relPath = path.relative('src/api/lambda', entry);
    const outFile = path.join(outBaseDir, relPath).replace(/\.ts$/, '.js');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',
      target: 'node22',
      format: 'cjs',
      outfile: outFile,
      sourcemap: false,
      external: ['aws-sdk', 'lambda-layers'],
      alias: {
        '@': path.resolve(__dirname, '../'),
      }
    });

    console.log(`✔ Built ${entry} → ${outFile}`);
  }
})();
