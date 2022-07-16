import { RollupOptions } from 'rollup';
import swc from 'rollup-plugin-swc';
import typescript2 from '@rollup/plugin-typescript';
import typescript from 'typescript';

const isDevelopment = process.env.BUILD === 'development';

const rollupConfig: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: '<LIB-NAME>',
      sourcemap: true,
      interop: false,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
      interop: false,
    },
  ],
  plugins: [
    typescript2({
      typescript,
      tsconfig: './tsconfig.json',
      include: ['./src/**.*'],
      emitDeclarationOnly: true,
    }),
    swc({
      sourceMaps: true,
      minify: true,
      jsc: {
        minify: {
          compress: {
            drop_console: !isDevelopment,
          },
          mangle: true,
        },
      },
      env: {
        targets: {
          browsers: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
        },
        mode: 'entry',
        coreJs: '3',
      },
    }),
  ],
};

export default rollupConfig;
