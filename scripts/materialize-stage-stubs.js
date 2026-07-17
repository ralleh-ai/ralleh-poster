#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, 'reports', 'validation-report.json');
const EXAMPLES_DIR = path.join(ROOT, 'examples');
const DRAFT_DIR = path.join(EXAMPLES_DIR, 'drafts');

function slugFromStage(stage) {
  const m = String(stage || '').match(/(\d+)/);
  const n = m ? Number(m[1]) : null;
  if (!n) return 'stage-unknown';
  return `stage-${String(n).padStart(2, '0')}`;
}

function toDraftPath(stage) {
  return path.join(DRAFT_DIR, `draft-${slugFromStage(stage)}-coverage.md`);
}

function loadReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('Missing reports/validation-report.json. Run npm run validate first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
}

function draftPreamble(item) {
  return [
    '<!--',
    'AUTO-GENERATED DRAFT STUB',
    'Guardrail: this file is intentionally NOT matched by validation example filename regex.',
    'To activate in scoring/CI, finalize content and rename to example-XX-<success|failure>-<theme>.md.',
    `Source stage target: ${item.stage}`,
    '-->',
    ''
  ].join('\n');
}

function main() {
  const report = loadReport();
  const plan = Array.isArray(report.stageExpansionPlan) ? report.stageExpansionPlan : [];

  if (plan.length === 0) {
    console.log('No stage expansion targets found. Nothing to materialize.');
    return;
  }

  fs.mkdirSync(DRAFT_DIR, { recursive: true });

  const created = [];
  const skipped = [];

  for (const item of plan) {
    const p = toDraftPath(item.stage);
    if (fs.existsSync(p)) {
      skipped.push(path.relative(ROOT, p));
      continue;
    }

    const body = draftPreamble(item) + (item.templateStub || '');
    fs.writeFileSync(p, body);
    created.push(path.relative(ROOT, p));
  }

  if (created.length > 0) {
    console.log('Created draft stubs:');
    created.forEach((f) => console.log(`- ${f}`));
  }
  if (skipped.length > 0) {
    console.log('Skipped existing draft stubs:');
    skipped.forEach((f) => console.log(`- ${f}`));
  }

  const manifestPath = path.join(DRAFT_DIR, '_manifest.json');
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceReport: 'reports/validation-report.json',
    count: plan.length,
    draftFiles: plan.map((item) => path.relative(ROOT, toDraftPath(item.stage))),
    stages: plan.map((item) => item.stage)
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${path.relative(ROOT, manifestPath)}`);
}

main();
