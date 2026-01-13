import { defineConfig, Plugin } from 'vite';
import banner from 'vite-plugin-banner';
import prettier from 'rollup-plugin-prettier';
import { resolve } from 'path';
import config from './betterdiscord.config';

// const OUT_DIR = resolve(`${process.env.APPDATA}/BetterDiscord/plugins`); // Use if you want to output in plugins folder directly.
const OUT_DIR = 'dist';

// Plugin to transform raw CSS imports into multiline template literals for easier review
function rawCssMultiline(): Plugin {
  return {
    name: 'raw-css-multiline',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.css?raw')) {
        const fs = require('fs');
        const cssPath = id.replace(/\?raw$/, '');
        const css = fs.readFileSync(cssPath, 'utf-8');
        // Export as a template literal to preserve multiline formatting in output
        return `export default \`\n${css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\``;
      }
    },
  };
}

export default defineConfig(() => ({
  plugins: [
    rawCssMultiline(),
    prettier({
      parser: 'babel',
      printWidth: 100,
      trailingComma: 'es5',
    }),
    banner({
      content: `/**${Object.entries(config)
        .map((value) => `\n * @${value[0]} ${value[1]}`)
        .join('')}\n */`,
      outDir: OUT_DIR,
    }),
  ],
  build: {
    outDir: OUT_DIR,
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: config.name,
      fileName: () => `${config.name}.plugin.js`,
      formats: ['iife' as const],
    },
    minify: false,
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'BdApi.React',
        },
      },
    },
  },
}));
