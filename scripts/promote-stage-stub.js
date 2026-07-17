#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const EXAMPLES_DIR = path.join(ROOT, 'examples');
const DRAFTS_DIR = path.join(EXAMPLES_DIR, 'drafts');
const README_PATH = path.join(EXAMPLES_DIR, 'README.md');
const MANIFEST_PATH = path.join(DRAFTS_DIR, '_manifest.json');

function parseArgs(argv) {
  const args = { stage: null, draft: null, theme: 'coverage', mode: null, dryRun: false, allowRegression: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--stage') args.stage = argv[++i] || null;
    else if (a === '--draft') args.draft = argv[++i] || null;
    else if (a === '--theme') args.theme = (argv[++i] || 'coverage').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    else if (a === '--mode') args.mode = argv[++i] || null;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--allow-regression') args.allowRegression = true;
  }
  return args;
}

function readValidationReport() {
  const p = path.join(ROOT, 'reports', 'validation-report.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function ensureBaselineValidation() {
  execSync('node scripts/validate-content.js', { cwd: ROOT, stdio: 'inherit' });
  return readValidationReport();
}

function listDrafts() {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  return fs.readdirSync(DRAFTS_DIR)
    .filter((f) => /^draft-stage-\d{2}-.*\.md$/.test(f))
    .map((f) => ({
      name: f,
      fullPath: path.join(DRAFTS_DIR, f),
      stageNum: Number((f.match(/stage-(\d{2})/) || [])[1] || 0)
    }))
    .sort((a, b) => a.stageNum - b.stageNum || a.name.localeCompare(b.name));
}

function pickDraft(drafts, args) {
  if (args.draft) {
    const wanted = path.basename(args.draft);
    return drafts.find((d) => d.name === wanted) || null;
  }
  if (args.stage) {
    const n = Number(String(args.stage).replace(/[^0-9]/g, ''));
    if (n > 0) return drafts.find((d) => d.stageNum === n) || null;
  }
  return drafts[0] || null;
}

function inferMode(content, explicitMode) {
  if (explicitMode === 'success' || explicitMode === 'failure') return explicitMode;
  if (/^- Example Type:\s*Negative\b/im.test(content)) return 'failure';
  return 'success';
}

function nextExampleIndex() {
  const files = fs.readdirSync(EXAMPLES_DIR).filter((f) => /^example-\d{2}-.*\.md$/.test(f));
  let max = 0;
  for (const f of files) {
    const m = f.match(/^example-(\d{2})-/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return String(max + 1).padStart(2, '0');
}

function stripDraftPreamble(content) {
  return content.replace(/^<!--\nAUTO-GENERATED DRAFT STUB[\s\S]*?-->\n?/m, '').trimStart();
}

function updateExamplesReadme(readmeContent, newFile) {
  const lines = readmeContent.split('\n');
  const start = lines.findIndex((l) => l.trim() === '## Available Cases');
  if (start < 0) throw new Error('examples/README.md missing "## Available Cases" section');

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const block = lines.slice(start + 1, end);
  const bullets = block
    .map((l) => l.match(/^\s*-\s+`([^`]+)`\s*$/))
    .filter(Boolean)
    .map((m) => m[1]);

  if (!bullets.includes(newFile)) bullets.push(newFile);
  bullets.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const newBlock = [''].concat(bullets.map((f) => `- \`${f}\``));
  const nextLines = [...lines.slice(0, start + 1), ...newBlock, ...lines.slice(end)];
  return nextLines.join('\n');
}

function updateManifestAfterPromotion(promotedDraftName, promotedStage) {
  if (!fs.existsSync(MANIFEST_PATH)) return;
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    manifest.generatedAt = new Date().toISOString();
    manifest.draftFiles = (manifest.draftFiles || []).filter((f) => path.basename(f) !== promotedDraftName);
    manifest.stages = (manifest.stages || []).filter((s) => s !== promotedStage);
    manifest.count = manifest.draftFiles.length;
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  } catch {
    // best effort: leave manifest unchanged if parse/write fails
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const baseline = ensureBaselineValidation();

  const drafts = listDrafts();
  if (drafts.length === 0) {
    console.log('No draft stage stubs found in examples/drafts/.');
    return;
  }

  const chosen = pickDraft(drafts, args);
  if (!chosen) {
    console.error('No matching draft found for provided selector.');
    process.exit(1);
  }

  const raw = fs.readFileSync(chosen.fullPath, 'utf8');
  const mode = inferMode(raw, args.mode);
  const idx = nextExampleIndex();
  const targetName = `example-${idx}-${mode}-${args.theme}.md`;
  const targetPath = path.join(EXAMPLES_DIR, targetName);
  const promotedContent = stripDraftPreamble(raw);

  if (fs.existsSync(targetPath)) {
    console.error(`Target already exists: ${path.relative(ROOT, targetPath)}`);
    process.exit(1);
  }

  const originalReadme = fs.readFileSync(README_PATH, 'utf8');
  const updatedReadme = updateExamplesReadme(originalReadme, targetName);

  if (args.dryRun) {
    console.log('DRY RUN');
    console.log(`Would promote: ${path.relative(ROOT, chosen.fullPath)} -> examples/${targetName}`);
    console.log(`Would remove draft after passing validation: ${path.relative(ROOT, chosen.fullPath)}`);
    return;
  }

  try {
    fs.writeFileSync(targetPath, promotedContent);
    fs.writeFileSync(README_PATH, updatedReadme);

    execSync('node scripts/validate-content.js', { cwd: ROOT, stdio: 'inherit' });

    const post = readValidationReport();
    const baselineScore = baseline?.summary?.overallScore ?? null;
    const baselineWarnings = baseline?.warnings?.length ?? null;
    const postScore = post?.summary?.overallScore ?? null;
    const postWarnings = post?.warnings?.length ?? null;

    const scoreRegressed = baselineScore != null && postScore != null && postScore < baselineScore;
    const warningsRegressed = baselineWarnings != null && postWarnings != null && postWarnings > baselineWarnings;

    if (!args.allowRegression && (scoreRegressed || warningsRegressed)) {
      throw new Error(
        `Promotion blocked by guardrail (baseline score/warnings: ${baselineScore}/${baselineWarnings}, post score/warnings: ${postScore}/${postWarnings}). ` +
        'Improve draft quality or rerun with --allow-regression if intentionally accepting a temporary dip.'
      );
    }

    fs.unlinkSync(chosen.fullPath);
    updateManifestAfterPromotion(chosen.name, `Stage ${chosen.stageNum}`);

    console.log(`Promoted ${path.relative(ROOT, chosen.fullPath)} -> examples/${targetName}`);
    console.log('Preflight validation passed.');
  } catch (err) {
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.writeFileSync(README_PATH, originalReadme);
    console.error('Promotion failed during preflight validation; changes were rolled back.');
    if (err && err.message) console.error(err.message);
    process.exit(1);
  }
}

main();
