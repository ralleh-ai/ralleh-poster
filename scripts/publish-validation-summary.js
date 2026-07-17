#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports');
const REPORT_PATH = path.join(REPORTS_DIR, 'validation-report.json');
const TRENDS_PATH = path.join(REPORTS_DIR, 'validation-trends.json');
const SUMMARY_PATH = path.join(REPORTS_DIR, 'validation-summary.md');
const BADGES_PATH = path.join(REPORTS_DIR, 'quality-badges.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function scoreGrade(score) {
  if (score >= 98) return 'A+';
  if (score >= 95) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C';
  if (score >= 70) return 'D';
  return 'F';
}

function badgeColor(score) {
  if (score >= 95) return 'brightgreen';
  if (score >= 90) return 'green';
  if (score >= 85) return 'yellowgreen';
  if (score >= 80) return 'yellow';
  if (score >= 70) return 'orange';
  return 'red';
}

function warningsColor(w) {
  if (w === 0) return 'brightgreen';
  if (w <= 3) return 'green';
  if (w <= 7) return 'yellow';
  return 'orange';
}

if (!fs.existsSync(REPORT_PATH)) {
  console.error(`Missing ${REPORT_PATH}. Run validation first.`);
  process.exit(1);
}
if (!fs.existsSync(TRENDS_PATH)) {
  console.error(`Missing ${TRENDS_PATH}. Run validation first.`);
  process.exit(1);
}

const report = loadJson(REPORT_PATH);
const trends = loadJson(TRENDS_PATH);

const summary = report.summary || {};
const score = summary.overallScore ?? 0;
const warnings = summary.warnings ?? 0;
const errors = summary.errors ?? 0;
const delta = summary.trendDeltaFromPrevious;
const status = (report.status || (errors > 0 ? 'fail' : 'pass')).toUpperCase();

const badges = {
  generatedAt: new Date().toISOString(),
  score: {
    label: 'quality-score',
    message: `${score}`,
    color: badgeColor(score),
    grade: scoreGrade(score)
  },
  status: {
    label: 'validation',
    message: status,
    color: errors > 0 ? 'red' : 'brightgreen'
  },
  warnings: {
    label: 'warnings',
    message: `${warnings}`,
    color: warningsColor(warnings)
  },
  coverage: {
    label: 'standards-refs',
    message: `${summary.distinctStandardsRefs ?? 0}`,
    color: (summary.distinctStandardsRefs ?? 0) >= 12 ? 'brightgreen' : 'yellowgreen'
  },
  trend: {
    label: 'trend-delta',
    message: delta == null ? 'n/a' : `${delta > 0 ? '+' : ''}${delta}`,
    color: delta == null ? 'lightgrey' : delta > 0 ? 'brightgreen' : delta < 0 ? 'orange' : 'green'
  }
};

const topRemediation = (report.remediation || []).slice(0, 5);
const topWeakExamples = [...(report.examples || [])]
  .sort((a, b) => a.score - b.score)
  .slice(0, 3);
const topImprovementPlan = (report.improvementPlan || []).slice(0, 5);

const latestRegressionHint = Array.isArray(trends.regressionHints) && trends.regressionHints.length > 0
  ? trends.regressionHints[trends.regressionHints.length - 1]
  : null;

const lines = [];
lines.push('# Validation Summary');
lines.push('');
lines.push(`- **Status:** ${status}`);
lines.push(`- **Overall Score:** ${score} (${scoreGrade(score)})`);
lines.push(`- **Errors:** ${errors}`);
lines.push(`- **Warnings:** ${warnings}`);
lines.push(`- **Trend Delta:** ${delta == null ? 'n/a' : `${delta > 0 ? '+' : ''}${delta}`}`);
lines.push(`- **Changed Files Since Previous Distinct Commit:** ${summary.changedFilesSincePreviousDistinct ?? 'n/a'}`);
lines.push(`- **Examples:** ${summary.examples ?? 0}`);
lines.push(`- **Distinct Standards Refs:** ${summary.distinctStandardsRefs ?? 0}`);
lines.push(`- **Represented Stages:** ${(summary.representedStages || []).join(', ') || 'n/a'}`);
lines.push('');

lines.push('## Quality Badges');
lines.push('');
for (const key of ['score', 'status', 'warnings', 'coverage', 'trend']) {
  const b = badges[key];
  lines.push(`- **${b.label}**: ${b.message} (${b.color})`);
}
lines.push('');

lines.push('## Lowest-Scoring Examples');
lines.push('');
if (topWeakExamples.length === 0) {
  lines.push('- none');
} else {
  topWeakExamples.forEach((e) => {
    lines.push('- `' + e.file + '`: ' + e.score + '/100 (stage: ' + (e.stage || 'n/a') + ', type: ' + (e.type || 'n/a') + ')');
  });
}
lines.push('');

lines.push('## Top Remediation Actions');
lines.push('');
if (topRemediation.length === 0) {
  lines.push('- none');
} else {
  topRemediation.forEach((r) => {
    lines.push('- **[' + r.priority + ']** `' + r.file + '` — ' + r.issue + ' → ' + r.action);
  });
}
lines.push('');

lines.push('## Next-Best Improvements (Expected Impact)');
lines.push('');
if (topImprovementPlan.length === 0) {
  lines.push('- none');
} else {
  topImprovementPlan.forEach((p, i) => {
    lines.push((i + 1) + '. `' + p.file + '` (stage: ' + p.stage + ', type: ' + (p.type || 'n/a') + ') — current ' + p.currentScore + ', target ' + p.targetScore + ', expected impact +~' + p.estimatedImpactPoints);
    (p.actions || []).slice(0, 3).forEach((a) => lines.push('   - ' + a));
  });
}
lines.push('');

if (latestRegressionHint) {
  lines.push('## Regression Culprit Hints');
  lines.push('');
  lines.push(`- **Delta:** ${latestRegressionHint.delta}`);
  lines.push(`- **Range:** ${latestRegressionHint.fromHead} .. ${latestRegressionHint.toHead}`);
  lines.push(`- **Changed Files:** ${latestRegressionHint.changedFiles.length}`);
  lines.push(`- **Likely Culprits:** ${(latestRegressionHint.likelyCulprits || []).join(', ') || 'n/a'}`);
  lines.push(`- **Lowest-Scoring Examples:** ${(latestRegressionHint.lowestScoringExamples || []).join(', ') || 'n/a'}`);
  lines.push('');
}

if (Array.isArray(trends.history)) {
  const tail = trends.history.slice(-5);
  lines.push('## Recent Score Trend (last 5 runs)');
  lines.push('');
  tail.forEach((t, i) => {
    const d = t.diffFromPreviousDistinct?.delta;
    const deltaText = d == null ? 'n/a' : `${d > 0 ? '+' : ''}${d}`;
    lines.push(`${i + 1}. ${t.generatedAt} — score ${t.overallScore}, warnings ${t.warnings}, errors ${t.errors}, Δ ${deltaText}`);
  });
  lines.push('');
}

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(BADGES_PATH, JSON.stringify(badges, null, 2));
fs.writeFileSync(SUMMARY_PATH, lines.join('\n'));

console.log(`Wrote ${path.relative(ROOT, BADGES_PATH)}`);
console.log(`Wrote ${path.relative(ROOT, SUMMARY_PATH)}`);
