await Bun.build({
  entrypoints: ['./index.ts'],
  target: 'bun',
  minify: true,
  outdir: 'build-js',
})