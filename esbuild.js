const [command] = process.argv.slice(2);

const PROD = command === 'build';
const WATCH = command === 'watch';

require('esbuild').build({
    entryPoints: ['src/ts/app.ts'],
    outfile: 'www/static/js/app.js',
    minify: PROD,
    bundle: true,
    platform: 'browser',
    target: 'es2015',
    sourcemap: !PROD,
    watch: WATCH,
    color: true,
});
