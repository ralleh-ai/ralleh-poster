#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, 'reports', 'validation-report.json');

const requiredFiles = [
  'SKILL.md', 'README.md', 'CORE_RULES.md', 'WORKFLOW.md', 'STANDARDS.md', 'TEMPLATES.md',
  'TOOLS.md', 'LLM_INSTRUCTIONS.md', 'llm-reference.md', 'FULL_LLM_REFERENCE.md', 'CHANGELOG.md',
  'examples/README.md', 'examples/FEW_SHOT_TEMPLATE.md', 'docs/installation.md', 'docs/ideogram-integration.md'
];

const requiredAuthorityFiles = ['CORE_RULES.md', 'WORKFLOW.md', 'STANDARDS.md', 'TEMPLATES.md'];
const requiredExampleSections = [
  '- Outcome:', '- Example Type:', '- Primary Stage Checkpoint:', '- Primary Rules Referenced:',
  '## 1) Event Brief', '## 2) Candidate Strategy / Prompt', '## 3) Critique Mapping',
  '## 4) Final Result', '## 5) Lesson Captured', '## 6) Technical Manifest'
];

const antiSlopKeywords = [
  'textless plate', 'zero digital rendering', 'zero plastic', 'matte paper', 'halftone', 'ink bleed',
  'zero glow', 'zero gradients', 'no photorealism', 'no 3d', 'negative space', 'zero neon'
];

const report = {
  generatedAt: new Date().toISOString(),
  version: '2.5.0',
  status: 'pass',
  errors: [],
  warnings: [],
  summary: {},
  examples: []
};

function addError(msg) {
  report.errors.push(msg);
  report.status = 'fail';
}

function addWarning(msg) {
  report.warnings.push(msg);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function assertIncludes(rel, needle, msg) {
  const txt = read(rel);
  if (!txt.includes(needle)) addError(msg || `${rel} missing expected content: ${needle}`);
}

function extractMetaLine(txt, key) {
  const m = txt.match(new RegExp(`^- ${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : '';
}

function getPromptBlocks(txt) {
  return [...txt.matchAll(/```text([\s\S]*?)```/g)].map((m) => m[1].toLowerCase());
}

function countCritiqueRows(txt) {
  const m = txt.match(/## 3\) Critique Mapping([\s\S]*?)## 4\) Final Result/m);
  if (!m) return 0;
  const rows = m[1].split('\n').filter((l) => /^\|.*\|$/.test(l.trim()));
  return Math.max(0, rows.length - 2);
}

function scoreExample({ hasAllSections, refsCount, keywordHits, critiqueRows, metadataConsistent, hasMethod }) {
  let score = 0;
  // schema completeness (25)
  score += hasAllSections ? 25 : 0;
  // rule refs (20)
  if (refsCount >= 5) score += 20;
  else if (refsCount >= 4) score += 16;
  else if (refsCount >= 3) score += 12;
  // prompt anti-slop quality (20)
  if (keywordHits >= 5) score += 20;
  else if (keywordHits >= 4) score += 16;
  else if (keywordHits >= 3) score += 12;
  else if (keywordHits >= 2) score += 8;
  // critique depth (20)
  if (critiqueRows >= 5) score += 20;
  else if (critiqueRows >= 4) score += 16;
  else if (critiqueRows >= 3) score += 12;
  // metadata consistency + method declaration (15)
  score += metadataConsistent ? 10 : 0;
  score += hasMethod ? 5 : 0;
  return Math.min(100, score);
}

// File presence
for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(ROOT, rel))) addError(`Missing required file: ${rel}`);
}

// SKILL/frontmatter sanity
const skill = read('SKILL.md');
if (!/^---\n[\s\S]*\n---\n/m.test(skill)) addError('SKILL.md missing valid frontmatter block');
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
const noLegacy = ['WORKFLOW.md', 'TOOLS.md', 'STANDARDS.md', 'docs/ideogram-integration.md', 'examples/example-05-failure-typography.md'];
for (const rel of noLegacy) {
  const txt = read(rel);
  if (/\bideogram\/v2\b/.test(txt)) addError(`${rel} contains legacy model name ideogram/v2`);
  if (/\blitellm\/ideogram-v2\b/.test(txt)) addError(`${rel} contains legacy model name litellm/ideogram-v2`);
}
assertIncludes('TOOLS.md', 'litellm/ideogram-v4', 'TOOLS.md missing canonical Method B model litellm/ideogram-v4');
assertIncludes('TOOLS.md', 'fal/flux-pro', 'TOOLS.md missing canonical Method A model fal/flux-pro');
assertIncludes('WORKFLOW.md', 'litellm/ideogram-v4', 'WORKFLOW.md missing canonical Method B model litellm/ideogram-v4');

// Example validation + weighted scoring
const examplesDir = path.join(ROOT, 'examples');
const exampleFiles = fs.readdirSync(examplesDir).filter((f) => /^example-\d{2}-.*\.md$/.test(f)).sort();
if (exampleFiles.length < 6) addError(`Expected at least 6 example files, found ${exampleFiles.length}`);

const distinctRuleRefs = new Set();
let totalScore = 0;

for (const name of exampleFiles) {
  const rel = path.join('examples', name);
  const txt = read(rel);
  const issues = { errors: [], warnings: [] };

  let hasAllSections = true;
  for (const section of requiredExampleSections) {
    if (!txt.includes(section)) {
      hasAllSections = false;
      issues.errors.push(`missing required section: ${section}`);
      addError(`${rel} missing required section: ${section}`);
    }
  }

  const outcome = extractMetaLine(txt, 'Outcome');
  const type = extractMetaLine(txt, 'Example Type');
  const rules = extractMetaLine(txt, 'Primary Rules Referenced');

  if (!outcome) { issues.errors.push('missing Outcome metadata'); addError(`${rel} missing Outcome metadata`); }
  if (!type) { issues.errors.push('missing Example Type metadata'); addError(`${rel} missing Example Type metadata`); }
  if (!rules) { issues.errors.push('missing Primary Rules Referenced metadata'); addError(`${rel} missing Primary Rules Referenced metadata`); }

  const refs = rules.match(/§\d+\.\d+/g) || [];
  refs.forEach((r) => distinctRuleRefs.add(r));

  if (refs.length < 3) {
    issues.errors.push('must reference at least 3 standards sections');
    addError(`${rel} must reference at least 3 standards sections`);
  } else if (refs.length < 4) {
    issues.warnings.push('low standards reference density (<4)');
    addWarning(`${rel} warning: low standards reference density (<4)`);
  }

  const positiveMismatch = /positive/i.test(type) && !/success/i.test(outcome);
  const negativeMismatch = /negative/i.test(type) && !/failure/i.test(outcome);
  const metadataConsistent = !positiveMismatch && !negativeMismatch;

  if (positiveMismatch) { issues.errors.push('type/outcome mismatch (Positive without Success)'); addError(`${rel} has Example Type Positive but Outcome is not Success`); }
  if (negativeMismatch) { issues.errors.push('type/outcome mismatch (Negative without Failure)'); addError(`${rel} has Example Type Negative but Outcome does not include Failure`); }

  const hasMethod = /Method\s*[AB]/.test(txt);
  if (!hasMethod) { issues.errors.push('missing explicit Method A/B declaration'); addError(`${rel} must explicitly specify typography Method A or Method B`); }

  const promptBlocks = getPromptBlocks(txt);
  if (promptBlocks.length === 0) {
    issues.errors.push('missing ```text prompt block');
    addError(`${rel} must include at least one \`\`\`text prompt block`);
  }

  const bestKeywordHits = Math.max(0, ...promptBlocks.map((p) => antiSlopKeywords.filter((k) => p.includes(k)).length));
  if (bestKeywordHits < 2) {
    issues.errors.push('prompt anti-slop quality too weak (<2 keywords)');
    addError(`${rel} prompt quality too weak: expected at least 2 anti-slop keywords in a prompt block`);
  } else if (bestKeywordHits < 4) {
    issues.warnings.push('prompt anti-slop density moderate (<4 keywords)');
    addWarning(`${rel} warning: prompt anti-slop density moderate (<4 keywords)`);
  }

  const critiqueRows = countCritiqueRows(txt);
  if (critiqueRows < 3) {
    issues.errors.push('critique mapping too shallow (<3 rows)');
    addError(`${rel} critique mapping must include at least 3 rule checks`);
  } else if (critiqueRows < 4) {
    issues.warnings.push('critique mapping depth moderate (<4 rows)');
    addWarning(`${rel} warning: critique mapping depth moderate (<4 rows)`);
  }

  if (/negative/i.test(type) && !/fail/i.test(txt.toLowerCase())) {
    issues.errors.push('negative example does not explicitly show failure detection');
    addError(`${rel} is Negative but does not explicitly show failure detection`);
  }

  const score = scoreExample({
    hasAllSections,
    refsCount: refs.length,
    keywordHits: bestKeywordHits,
    critiqueRows,
    metadataConsistent,
    hasMethod
  });

  totalScore += score;
  if (score < 70) addError(`${rel} quality score too low (${score}/100)`);
  else if (score < 85) addWarning(`${rel} quality score moderate (${score}/100)`);

  report.examples.push({
    file: rel,
    score,
    metrics: {
      standardsRefs: refs.length,
      antiSlopKeywordHits: bestKeywordHits,
      critiqueRows,
      hasMethod,
      metadataConsistent
    },
    ...issues
  });
}

if (distinctRuleRefs.size < 8) {
  addError(`Example corpus rule coverage too narrow: only ${distinctRuleRefs.size} distinct standards refs found (min 8)`);
} else if (distinctRuleRefs.size < 10) {
  addWarning(`Example corpus rule coverage moderate: ${distinctRuleRefs.size} distinct standards refs`);
}

// Markdown local link check
const mdFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'reports') continue;
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
    if (!fs.existsSync(resolved)) addError(`${path.relative(ROOT, file)} has broken local link: ${raw}`);
  }
}

const overallScore = exampleFiles.length ? Math.round(totalScore / exampleFiles.length) : 0;
if (overallScore < 75) addError(`Overall quality score too low (${overallScore}/100)`);
else if (overallScore < 88) addWarning(`Overall quality score moderate (${overallScore}/100)`);

report.summary = {
  examples: exampleFiles.length,
  distinctStandardsRefs: distinctRuleRefs.size,
  overallScore,
  errors: report.errors.length,
  warnings: report.warnings.length
};

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

if (report.errors.length > 0) {
  console.error(`❌ Validation failed with ${report.errors.length} error(s) and ${report.warnings.length} warning(s).`);
  console.error(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
  process.exit(1);
}

console.log(`✅ Validation passed (score: ${overallScore}/100, warnings: ${report.warnings.length})`);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
