import { spawnSync, spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { closeSync, openSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
// Create an empty database if absent, preserving existing local records.
closeSync(openSync('prisma/local/nelly.db', 'a'));
// Local settings never overwrite the PostgreSQL environment or its migrations.
process.env.DATABASE_URL = `file:${root}prisma/local/nelly.db`;
process.env.AUTH_SECRET = randomBytes(48).toString('hex');
process.env.NODE_ENV = 'development';
process.env.WATCHPACK_POLLING = '1000';
process.env.PATH = `${fileURLToPath(new URL('.', `file://${process.execPath}`))}:${process.env.PATH}`;
function run(file, args) {
  const result = spawnSync(process.execPath, [file, ...args], { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
run('node_modules/prisma/build/index.js', ['generate', '--schema', 'prisma/local/schema.prisma']);
run('node_modules/prisma/build/index.js', ['migrate', 'deploy', '--schema', 'prisma/local/schema.prisma']);
run('--import', ['tsx', 'prisma/seed.ts']);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3000'], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', code => process.exit(code ?? 0));
