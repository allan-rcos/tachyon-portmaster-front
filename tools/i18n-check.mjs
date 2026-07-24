// ============================================================
//  Validação do i18n como CONTRATO BILATERAL via JSON Schema (draft 2020-12/ajv).
//  Os `*.messages.schema.json` são a fonte única e validam os DOIS lados:
//
//   (a) DADOS    — cada `messages/{pt-BR,en,es}.json` precisa conter TODAS as
//                  chaves exigidas por cada schema, com valor string não-vazio.
//                  Falta/valor vazio em QUALQUER locale = FATAL.
//   (b) RESOLVER — o `messages.ts`/`*.messages.ts` irmão de cada schema precisa
//                  referenciar EXATAMENTE as chaves declaradas no schema
//                  (chaves `m.<key>({}` diretas + expansão recursiva dos spreads
//                  `...<fn>(locale)`). Chave usada e não declarada, ou declarada
//                  e não usada = FATAL.
//
//   Órfãs (chave em pt-BR.json exigida por nenhum schema) = WARNING.
//
//  Uso: `bun run i18n:check`. Sai != 0 em qualquer FATAL (dados OU resolver).
// ============================================================
import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import AjvModule from 'ajv/dist/2020.js';

const Ajv2020 = AjvModule.default || AjvModule;

const root = process.cwd();
const locales = ['pt-BR', 'en', 'es'];
const base = 'pt-BR';

// Fragmentos compartilhados (features/core/i18n/schemas) ↔ resolvers de common.ts.
const FRAGMENT_RESOLVER = { common: 'commonText', val: 'valText', nav: 'navText' };

// ---------------------------------------------------------------- coleta de arquivos
const schemaFiles = [];
const resolverFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'paraglide' || entry.name === 'dist')
      continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.messages.schema.json')) schemaFiles.push(full);
    else if (entry.name === 'messages.ts' || entry.name.endsWith('.messages.ts'))
      resolverFiles.push(full);
  }
}
for (const r of ['pages', 'features']) walk(join(root, r));
// common.ts hospeda os resolvers-base (commonText/valText/navText).
resolverFiles.push(join(root, 'features', 'core', 'i18n', 'common.ts'));

// ---------------------------------------------------------------- parse dos resolvers
// nome-do-resolver → { direct: Set<chave>, spreads: Set<nome>, file }
const resolvers = new Map();
const KEY_RE = /\bm\.([A-Za-z0-9_]+)\s*\(\s*\{\s*\}/g;
const SPREAD_RE = /\.\.\.(\w+)\s*\(\s*locale\s*\)/g;
const EXPORT_RE = /export\s+(?:const|function)\s+(\w+)\b/g;

function parseResolverFile(file) {
  const src = readFileSync(file, 'utf8');
  const marks = [];
  let m;
  EXPORT_RE.lastIndex = 0;
  while ((m = EXPORT_RE.exec(src))) marks.push({ name: m[1], index: m.index });
  marks.forEach((mark, i) => {
    const block = src.slice(mark.index, i + 1 < marks.length ? marks[i + 1].index : src.length);
    const direct = new Set();
    const spreads = new Set();
    let k;
    KEY_RE.lastIndex = 0;
    while ((k = KEY_RE.exec(block))) direct.add(k[1]);
    let s;
    SPREAD_RE.lastIndex = 0;
    while ((s = SPREAD_RE.exec(block))) spreads.add(s[1]);
    resolvers.set(mark.name, { direct, spreads, file });
  });
}
for (const f of resolverFiles) parseResolverFile(f);

// nome-do-resolver → Set de chaves referenciadas (spreads expandidos recursivamente)
const resolverKeysCache = new Map();
function resolverKeys(name, seen = new Set()) {
  if (resolverKeysCache.has(name)) return resolverKeysCache.get(name);
  const def = resolvers.get(name);
  if (!def) throw new Error(`resolver desconhecido no spread: ${name}`);
  if (seen.has(name)) return new Set(); // guarda contra ciclo
  seen.add(name);
  const keys = new Set(def.direct);
  for (const sp of def.spreads) for (const key of resolverKeys(sp, seen)) keys.add(key);
  resolverKeysCache.set(name, keys);
  return keys;
}

// ---------------------------------------------------------------- schemas (ajv)
const ajv = new Ajv2020({ allErrors: true, strict: false });
const schemasById = new Map(); // $id → objeto do schema
const schemaMeta = []; // { id, file }
for (const file of schemaFiles) {
  const schema = JSON.parse(readFileSync(file, 'utf8'));
  if (!schema.$id) throw new Error(`schema sem $id: ${file}`);
  ajv.addSchema(schema);
  schemasById.set(schema.$id, schema);
  schemaMeta.push({ id: schema.$id, file });
}

// $id → Set de chaves declaradas (required próprio + expansão recursiva dos $ref em allOf)
const schemaKeysCache = new Map();
function schemaKeys(id) {
  if (schemaKeysCache.has(id)) return schemaKeysCache.get(id);
  const schema = schemasById.get(id);
  if (!schema) throw new Error(`$ref para schema desconhecido: ${id}`);
  const keys = new Set(schema.required ?? []);
  for (const sub of schema.allOf ?? []) {
    if (sub.$ref) for (const key of schemaKeys(sub.$ref)) keys.add(key);
    for (const req of sub.required ?? []) keys.add(req);
  }
  schemaKeysCache.set(id, keys);
  return keys;
}

// ---------------------------------------------------------------- catálogos
function loadCatalog(locale) {
  const json = JSON.parse(readFileSync(join(root, 'messages', `${locale}.json`), 'utf8'));
  delete json['$schema'];
  return json;
}
const catalogs = Object.fromEntries(locales.map((l) => [l, loadCatalog(l)]));

// ---------------------------------------------------------------- checagens
let fatal = 0;
const warn = [];

// (b) RESOLVER — emparelha cada schema com seu resolver e compara os conjuntos.
function resolverForSchema(file) {
  if (file.replace(/\\/g, '/').includes('/i18n/schemas/')) {
    const stem = basename(file).replace(/\.messages\.schema\.json$/, '');
    return FRAGMENT_RESOLVER[stem];
  }
  const sib = basename(file).endsWith('route.messages.schema.json')
    ? join(dirname(file), 'messages.ts')
    : join(dirname(file), basename(file).replace(/\.schema\.json$/, '.ts'));
  const src = readFileSync(sib, 'utf8');
  const m = /export\s+const\s+(\w+)\s*=/.exec(src);
  if (!m) throw new Error(`resolver não encontrado no irmão de ${file}: ${sib}`);
  return m[1];
}

function diff(aSet, bSet) {
  return [...aSet].filter((x) => !bSet.has(x)).sort();
}

for (const { id, file } of schemaMeta) {
  const fnName = resolverForSchema(file);
  if (!fnName) {
    fatal++;
    console.error(`✖ schema sem resolver emparelhado: ${file}`);
    continue;
  }
  const declared = schemaKeys(id);
  const referenced = resolverKeys(fnName);
  const notDeclared = diff(referenced, declared); // usadas mas não no schema
  const notUsed = diff(declared, referenced); // no schema mas não usadas
  if (notDeclared.length || notUsed.length) {
    fatal++;
    console.error(
      `✖ contrato quebrado em ${basename(dirname(file))}/${basename(file)} (${fnName}):`,
    );
    if (notDeclared.length) console.error(`    usadas e não declaradas: ${notDeclared.join(', ')}`);
    if (notUsed.length) console.error(`    declaradas e não usadas:  ${notUsed.join(', ')}`);
  }
}

// (a) DADOS — valida cada catálogo contra cada schema (fatal p/ TODOS os locales).
for (const { id, file } of schemaMeta) {
  const validate = ajv.getSchema(id);
  for (const locale of locales) {
    if (validate(catalogs[locale])) continue;
    fatal++;
    const detail = (validate.errors ?? [])
      .map((e) => e.params?.missingProperty ?? `${e.instancePath} ${e.message}`)
      .join(', ');
    console.error(`✖ ${locale}.json não satisfaz ${basename(file)}: ${detail}`);
  }
}

// Órfãs — chave em pt-BR.json exigida por nenhum schema.
const required = new Set();
for (const { id } of schemaMeta) for (const key of schemaKeys(id)) required.add(key);
const orphans = Object.keys(catalogs[base])
  .filter((k) => !required.has(k))
  .sort();
if (orphans.length)
  warn.push(
    `⚠ ${orphans.length} chave(s) órfã(s) no ${base}.json (exigidas por nenhum schema):\n    ${orphans.join('\n    ')}`,
  );

// ---------------------------------------------------------------- saída
for (const w of warn) console.warn(w);
if (fatal) {
  console.error(`\ni18n:check falhou (${fatal} erro(s) fatal(is)).`);
  process.exit(1);
}
console.log(
  `i18n:check ok — ${schemaMeta.length} schemas, ${required.size} chaves exigidas, ${locales.length} locales completos.`,
);
