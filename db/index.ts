import { Database } from 'bun:sqlite';

const db = new Database('db/.sqlite', { strict: true });

const create = db.query(`
  create table if not exists pessoas (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    idade INTEGER NOT NULL,
    cidade TEXT NOT NULL
  );
`)

create.run()

export default db