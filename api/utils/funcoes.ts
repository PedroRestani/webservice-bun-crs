export function recursoDe(url: string, path: string) {
  const [, recurso] = new URL(url).pathname.split(path)

	return [
    recurso === '/' || recurso === '',
    recurso,
  ] as const
}
