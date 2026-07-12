import { readFileSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import jsonServer from 'json-server';
import { createYoga, createSchema } from 'graphql-yoga';
import { createResolvers } from './resolvers.js';
import type { Lead } from './resolvers.js';

const PORT = Number(process.env.PORT ?? 3001);
const CHAOS = process.env.CHAOS !== 'off';
const ERROR_RATE = Number(process.env.CHAOS_ERROR_RATE ?? 0.05);

const app = express();
const router = jsonServer.router(path.join(import.meta.dirname, 'db.json'));

// Health check ANTES do chaos middleware — evita que o health check do Render
// (ou de qualquer orquestrador) seja afetado por latência/erros simulados.
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// jsonServer.defaults() inclui logger, CORS e static file serving.
app.use(jsonServer.defaults({ logger: true }));

// Chaos middleware: simula latência de rede e falhas intermitentes de backend,
// úteis para exercitar loading/error states no front-end consumidor da API mock.
app.use((_req, res, next) => {
  if (!CHAOS) {
    next();
    return;
  }
  const delayMs = 300 + Math.random() * 500;
  setTimeout(() => {
    if (Math.random() < ERROR_RATE) {
      res.status(500).json({ error: 'Erro interno simulado (chaos)' });
      return;
    }
    next();
  }, delayMs);
});

const schemaPath = path.join(import.meta.dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf-8');

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    // O router.db é a MESMA instância lowdb usada pelo json-server para ler e
    // escrever leads/leads/:id (PATCH). Nunca reler db.json do disco aqui —
    // isso garantiria dados desatualizados após qualquer mutação via REST.
    resolvers: createResolvers(() => router.db.get('leads').value() as Lead[]),
  }),
  graphqlEndpoint: '/graphql',
});

app.use(yoga.graphqlEndpoint, yoga);

// bodyParser do json-server é necessário para o router processar PATCH/POST/PUT.
app.use(jsonServer.bodyParser);
app.use(router);

app.listen(PORT, () => {
  console.log(`Mini CRM API rodando em http://localhost:${PORT}`);
  console.log(`  REST:    http://localhost:${PORT}/leads`);
  console.log(`  GraphQL: http://localhost:${PORT}/graphql`);
  console.log(`  Health:  http://localhost:${PORT}/health`);
  console.log(`  Chaos:   ${CHAOS ? `ON (error rate ${ERROR_RATE})` : 'OFF'}`);
});
