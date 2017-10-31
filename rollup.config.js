import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './index.js',
  dest: './dist/index.js',
  format: 'cjs',
  external: [
    'axios',
    'qs'
  ],
  plugins: [
    resolve({
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
