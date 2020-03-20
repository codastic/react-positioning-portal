const typescript = require('rollup-plugin-typescript2');

const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies).concat(pkg.peerDependencies),
  output: [{
    dir: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'es'
  }],
  plugins: [typescript()],
};
