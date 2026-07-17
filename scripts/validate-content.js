#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const requiredFiles = [
  'SKILL.md',
  'README.md',
  'CORE_RULES.md',
  'WORKFLOW.md',
  'STANDARDS.md',
  'TEMPLATES.md',
  'TOOLS.md',
  'LLM_INSTRUCTIONS.md',
  'llm-reference.md',
  'FULL_LLM_REFERENCE.md',
  'CHANGELOG.md',
  'examples/README.md',
  'examples/FEW_SHOT_TEMPLATE.md',
  'docs/installation.md',
  'docs/ideogram-integration.md'
];

const requiredAuthorityFiles = ['CORE_RULES.md', 'WORKFLOW.md', 'STANDARDS.md', 'TEMPLATES.md'];
const requiredExampleSections = [
  '- Outcome:',
  '- Example Type:',
  '- Primary Stage Checkpoint:',
  '- Primary Rules Referenced:',
  '## 1) Event Brief',
  '## 2) Candidate Strategy / Prompt',
  '## 3) Critique Mapping',
  '## 4) Final Result',
  '## 5) Lesson Captured',
  '## 6) Technical Manifest'
];

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function assertIncludes(rel, needle, msg) {
  const txt = read(rel);
  if (!txt.includes(needle)) fail(msg || `${rel} missing expected content: ${needle}`);
}

// File presence
for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`Missing required file: ${rel}`);
}

// SKILL frontmatter sanity
const skill = read('SKILL.md');
if (!/^---\n[\s\S]*\n---\n/m.test(skill)) fail('SKILL.md missing valid frontmatter block');
assertIncludes('SKILL.md', 'name: ralleh-poster', 'SKILL.md missing canonical skill name');
assertIncludes('SKILL.md', 'metadata: {"openclaw"', 'SKILL.md missing single-line metadata.openclaw object');

// Authority consistency
for (const rel of requiredAuthorityFiles) {
  assertIncludes('README.md', rel, `README.md missing authority reference: ${rel}`);
  assertIncludes('SKILL.md', rel, `SKILL.md missing authority reference: ${rel}`);
  assertIncludes('LLM_INSTRUCTIONS.md', rel, `LLM_INSTRUCTIONS.md missing authority reference: ${rel}`);
}
assertIncludes('llm-reference.md', 'CORE_RULES.md', 'llm-reference.md missing CORE_RULES.md pointer');
assertIncludes('examples/README.md', 'FEW_SHOT_TEMPLATE.md', 'examples/README.md missing FEW_SHOT_TEMPLATE.md reference');

// Model naming consistency
const noLegacy = [
  'WORKFLOW.md',
  'TOOLS.md',
  'STANDARDS.md',
  'docs/ideogram-integration.md',
  'examples/example-05-failure-typography.md'
];
for (const rel of noLegacy) {
  const txt = read(rel);
  if (/\bideogram\/v2\b/.test(txt)) fail(`${rel} contains legacy model name ideogram/v2`);
  if (/\blitellm\/ideogram-v2\b/.test(txt)) fail(`${rel} contains legacy model name litellm/ideogram-v2`);
}
assertIncludes('TOOLS.md', 'litellm/ideogram-v4', 'TOOLS.md missing canonical Method B model litellm/ideogram-v4');
assertIncludes('TOOLS.md', 'fal/flux-pro', 'TOOLS.md missing canonical Method A model fal/flux-pro');
assertIncludes('WORKFLOW.md', 'litellm/ideogram-v4', 'WORKFLOW.md missing canonical Method B model litellm/ideogram-v4');

// Example schema validation
const examplesDir = path.join(ROOT, 'examples');
const exampleFiles = fs.readdirSync(examplesDir)
  .filter((f) => /^example-\d{2}-.*\.md$/.test(f))
  .sort();

if (exampleFiles.length < 6) fail(`Expected at least 6 example files, found ${exampleFiles.length}`);

for (const name of exampleFiles) {
  const rel = path.join('examples', name);
  const txt = read(rel);
  for (const section of requiredExampleSections) {
    if (!txt.includes(section)) fail(`${rel} missing required section: ${section}`);
  }
}

// Markdown local link check
const mdFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) mdFiles.push(full);
  }
})(ROOT);

const linkRegex = /\[[^\]]*\]\(([^)]+)\)/g;
for (const file of mdFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  for (const match of txt.matchAll(linkRegex)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('#') || raw.includes('://') || raw.startsWith('mailto:')) continue;
    const target = raw.split('#')[0];
    if (!target) continue;
    const resolved = path.normalize(path.join(path.dirname(file), target));
    if (!fs.existsSync(resolved)) {
      fail(`${path.relative(ROOT, file)} has broken local link: ${raw}`);
    }
  }
}

if (process.exitCode) {
  console.error('\nValidation failed.');
  process.exit(process.exitCode);
}

console.log('✅ Validation passed');
