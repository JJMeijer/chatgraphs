const [command] = process.argv.slice(2);

const PROD = command === 'build';
const WATCH = command === 'watch';

require('esbuild').build({
    entryPoints: ['src/ts/index.ts'],
    outfile: 'www/static/js/main.js',
    minify: PROD,
    bundle: true,
    platform: 'browser',
    target: 'es2015',
    sourcemap: !PROD,
    watch: WATCH,
    color: true,
});
