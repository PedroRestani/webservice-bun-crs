import { recursoDe } from './utils/funcoes'

import pessoas from './pessoas';

const notFound = new Response('Recurso não encontrado!', { status: 404 })

async function index() {
	const api = await import('../package.json').then(pkg =>
		Response.json(
			{ nome: 'webservice-bun', versao: pkg.version },
			{ status: 200 }
		)
	)

	return api
}

export function roteamento(req: Request) {
	const [isIndex, recurso] = recursoDe(req.url, '/api')

	if (isIndex) return index()

	if (recurso.startsWith('/pessoas')) return pessoas(req).then((res) => res ?? notFound);

	return notFound
}