#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const requiredFiles = [
  'SKILL.md',
  'CORE_RULES.md',
  'WORKFLOW.md',
  'STANDARDS.md',
  'TEMPLATES.md',
  'LLM_INSTRUCTIONS.md',
  'llm-reference.md',
  'FULL_LLM_REFERENCE.md',
  'examples/README.md',
  'examples/FEW_SHOT_TEMPLATE.md',
  'docs/installation.md'
];

const modelConvention = [
  /litellm\/ideogram-v4/g,
  /fal\/flux-pro/g
];

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

for (const rel of requiredFiles) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) fail(`Missing required file: ${rel}`);
}

const skill = fs.readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8');
if (!skill.includes('name: ralleh-poster')) fail('SKILL.md missing canonical name');
if (!skill.includes('metadata: {"openclaw"')) fail('SKILL.md missing single-line metadata.openclaw object');

const refs = fs.readFileSync(path.join(ROOT, 'llm-reference.md'), 'utf8');
if (!refs.includes('CORE_RULES.md')) fail('llm-reference.md missing CORE_RULES.md pointer');

const filesToScan = [
  'WORKFLOW.md',
  'TOOLS.md',
  'examples/example-05-failure-typography.md',
  'docs/ideogram-integration.md'
];

for (const rel of filesToScan) {
  const txt = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (/\bideogram\/v2\b/.test(txt)) fail(`${rel} contains legacy model name ideogram/v2`);
  if (/\blitellm\/ideogram-v2\b/.test(txt)) fail(`${rel} contains legacy model name litellm/ideogram-v2`);
}

for (const rel of ['TOOLS.md', 'WORKFLOW.md']) {
  const txt = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const rx of modelConvention) {
    if (!rx.test(txt) && rel === 'TOOLS.md') {
      fail(`${rel} missing expected model convention pattern: ${rx}`);
    }
  }
}

const examplesReadme = fs.readFileSync(path.join(ROOT, 'examples/README.md'), 'utf8');
if (!examplesReadme.includes('FEW_SHOT_TEMPLATE.md')) {
  fail('examples/README.md missing FEW_SHOT_TEMPLATE.md reference');
}

if (process.exitCode) {
  console.error('\nValidation failed.');
  process.exit(process.exitCode);
} else {
  console.log('✅ Validation passed');
}
