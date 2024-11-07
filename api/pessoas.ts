import { recursoDe } from './utils/funcoes';

import db from 'db/index';

interface DadosPessoa {
  nome: string;
  idade: number;
  cidade: string;
}

function list() {
  using pessoas = db.query('select * from pessoas order by id asc;');
  return Response.json(pessoas.all(), { status: 200 });
}

function create({ nome, idade, cidade }: DadosPessoa) {
  using insert = db.query('insert into pessoas (nome, idade, cidade) values (:nome, :idade, :cidade);')
  insert.get({ nome, idade, cidade });
  return Response.json(undefined, { status: 201 });
}

function get(id: number) {
  using select = db.query('select * from pessoas where id = :id;');
  const pessoa = select.get({ id });
  return Response.json(pessoa, { status: 200 });
}

function update(id: number, { nome, idade, cidade }: DadosPessoa) {
  const setClause = []

  if (nome) setClause.push(`nome = :nome`);
  if (idade) setClause.push(`idade = :idade`);
  if (cidade) setClause.push(`cidade = :cidade`);

  using update = db.query(`update pessoas set ${setClause.join(', ')} where id = :id;`);
  update.run({ id, nome, idade, cidade });
  return Response.json(undefined, { status: 200 });
}

function remove(id: number) {
  using remove = db.query('delete from pessoas where id = :id;');
  remove.run({ id });
  return Response.json(undefined, { status: 200 });
}

function index(method: string, body?: any) {
  if (method === 'GET') return list()
  if (method === 'POST') return create(body)
}

function pessoa(id: number, method: string, body?: any) {
  if (method === 'GET') return get(id);
  if (method === 'PUT') return update(id, body);
  if (method === 'DELETE') return remove(id);
}

async function roteamento(req: Request) {
  const [isIndex, recurso] = recursoDe(req.url, '/api/pessoas');

  if (isIndex) return index(req.method, req.body !== null ? await req.json() : undefined);

  const [recursoPorId] = recurso.match(/\d+$/) || []
  const id = Number(recursoPorId);

  if (Number.isInteger(id)) {
    return pessoa(id, req.method, req.body !== null ? await req.json() : undefined);
  }
}

export default roteamento;