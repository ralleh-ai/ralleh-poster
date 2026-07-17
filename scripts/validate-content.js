#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports');
const REPORT_PATH = path.join(REPORTS_DIR, 'validation-report.json');
const TRENDS_PATH = path.join(REPORTS_DIR, 'validation-trends.json');

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

const targetStages = [1, 2, 3, 4, 5, 6, 7];
const stageCoverageLock = {
  enabled: true,
  requiredStages: targetStages.map((s) => `Stage ${s}`)
};

const antiSlopKeywords = [
  'textless plate', 'zero digital rendering', 'zero plastic', 'matte paper', 'halftone', 'ink bleed',
  'zero glow', 'zero gradients', 'no photorealism', 'no 3d', 'negative space', 'zero neon'
];

const exampleTypeThresholds = {
  positive: { fail: 80, warn: 88 },
  negative: { fail: 72, warn: 82 }
};

const stageBudgets = {
  default: { fail: { refs: 3, critiqueRows: 3, keywordHits: 2 }, warn: { refs: 4, critiqueRows: 3, keywordHits: 3 } },
  'Stage 5': { fail: { refs: 3, critiqueRows: 3, keywordHits: 2 }, warn: { refs: 4, critiqueRows: 4, keywordHits: 4 } },
  'Stage 6': { fail: { refs: 3, critiqueRows: 3, keywordHits: 2 }, warn: { refs: 4, critiqueRows: 4, keywordHits: 4 } },
  'Stage 7': { fail: { refs: 3, critiqueRows: 3, keywordHits: 2 }, warn: { refs: 4, critiqueRows: 4, keywordHits: 4 } }
};

const report = {
  generatedAt: new Date().toISOString(),
  version: '2.16.0',
  status: 'pass',
  errors: [],
  warnings: [],
  remediation: [],
  improvementPlan: [],
  stageExpansionPlan: [],
  summary: {},
  policies: {
    exampleTypeThresholds,
    stageBudgets,
    targetStages,
    stageCoverageLock
  },
  examples: []
};

const remediationMap = new Map();

function addError(msg, suggestion) {
  report.errors.push(msg);
  report.status = 'fail';
  if (suggestion) reportRemediation(suggestion);
}

function addWarning(msg, suggestion) {
  report.warnings.push(msg);
  if (suggestion) reportRemediation(suggestion);
}

function reportRemediation(item) {
  const key = `${item.file || 'global'}::${item.issue}`;
  if (!remediationMap.has(key)) remediationMap.set(key, item);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function assertIncludes(rel, needle, msg, suggestion) {
  const txt = read(rel);
  if (!txt.includes(needle)) addError(msg || `${rel} missing expected content: ${needle}`, suggestion);
}

function extractMetaLine(txt, key) {
  const m = txt.match(new RegExp(`^- ${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : '';
}

function normalizeExampleType(raw) {
  if (!raw) return null;
  const t = raw.toLowerCase();
  if (t.includes('positive')) return 'positive';
  if (t.includes('negative')) return 'negative';
  return null;
}

function extractStageNumber(raw) {
  if (!raw) return null;
  const m = raw.match(/Stage\s*(\d+)/i);
  if (!m) return null;
  return Number(m[1]);
}

function stageKey(stageNum) {
  if (!stageNum) return 'default';
  return `Stage ${stageNum}`;
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
  score += hasAllSections ? 25 : 0;

  if (refsCount >= 5) score += 20;
  else if (refsCount >= 4) score += 16;
  else if (refsCount >= 3) score += 12;

  if (keywordHits >= 5) score += 20;
  else if (keywordHits >= 4) score += 16;
  else if (keywordHits >= 3) score += 12;
  else if (keywordHits >= 2) score += 8;

  if (critiqueRows >= 5) score += 20;
  else if (critiqueRows >= 4) score += 16;
  else if (critiqueRows >= 3) score += 12;

  score += metadataConsistent ? 10 : 0;
  score += hasMethod ? 5 : 0;
  return Math.min(100, score);
}

function buildImprovementCandidate({ rel, type, stageName, score, budget, refsCount, keywordHits, critiqueRows }) {
  const typeWarn = type && exampleTypeThresholds[type] ? exampleTypeThresholds[type].warn : 88;
  const gaps = {
    refsToWarnBudget: Math.max(0, budget.warn.refs - refsCount),
    keywordsToWarnBudget: Math.max(0, budget.warn.keywordHits - keywordHits),
    critiqueRowsToWarnBudget: Math.max(0, budget.warn.critiqueRows - critiqueRows),
    scoreToTypeWarnThreshold: Math.max(0, typeWarn - score)
  };

  const estimatedImpactPoints =
    gaps.refsToWarnBudget * 3 +
    gaps.keywordsToWarnBudget * 4 +
    gaps.critiqueRowsToWarnBudget * 3 +
    Math.ceil(gaps.scoreToTypeWarnThreshold / 2);

  if (estimatedImpactPoints <= 0) return null;

  const actions = [];
  if (gaps.refsToWarnBudget > 0) actions.push(`Add ${gaps.refsToWarnBudget}+ standards references in metadata/critique mapping.`);
  if (gaps.keywordsToWarnBudget > 0) actions.push(`Add ${gaps.keywordsToWarnBudget}+ anti-slop keywords in prompt block.`);
  if (gaps.critiqueRowsToWarnBudget > 0) actions.push(`Add ${gaps.critiqueRowsToWarnBudget}+ critique mapping rows.`);
  if (gaps.scoreToTypeWarnThreshold > 0) actions.push(`Raise score by ~${gaps.scoreToTypeWarnThreshold} to meet ${type || 'default'} warn threshold (${typeWarn}).`);

  return {
    file: rel,
    type,
    stage: stageName,
    currentScore: score,
    targetScore: typeWarn,
    estimatedImpactPoints,
    gaps,
    actions
  };
}

function buildStageStub(stage) {
  const method = stage >= 6 ? 'Method B (litellm/ideogram-v4)' : 'Method A (fal/flux-pro)';
  const refs = stage <= 2 ? '§1.1, §2.1, §3.1, §4.1' : stage >= 7 ? '§6.1, §6.2, §7.1, §7.3' : '§3.1, §4.2, §5.1, §5.3';
  return [
    `- Outcome: Success (candidate)` ,
    '- Example Type: Positive',
    `- Primary Stage Checkpoint: Stage ${stage}`,
    `- Primary Rules Referenced: ${refs}`,
    '',
    '## 1) Event Brief',
    `Stage ${stage} coverage expansion candidate for validator-driven corpus balancing.`,
    '',
    '## 2) Candidate Strategy / Prompt',
    `Primary typography path: ${method}`,
    '```text',
    'poster composition with strong hierarchy, textless plate, matte paper, halftone, ink bleed, zero glow, no photorealism',
    '```',
    '',
    '## 3) Critique Mapping',
    '| Check | Rule | Pass/Fail | Notes |',
    '|---|---|---|---|',
    '| Visual hierarchy | §3.1 | Pass | clear focal structure |',
    '| Typography control | §4.2 | Pass | method-aligned execution |',
    '| Material authenticity | §5.1 | Pass | analog print constraints preserved |',
    '',
    '## 4) Final Result',
    'Draft validated for stage coverage; iterate against stage-specific objectives.',
    '',
    '## 5) Lesson Captured',
    `Adds explicit Stage ${stage} representation to improve corpus breadth and checkpoint recall.`,
    '',
    '## 6) Technical Manifest',
    `model: ${stage >= 6 ? 'litellm/ideogram-v4' : 'fal/flux-pro'}`,
    'seed: TBD',
    'size: TBD'
  ].join('\n');
}

function buildStageExpansionPlan(stageSetInput) {
  const represented = new Set(Array.from(stageSetInput).map((s) => {
    const m = String(s).match(/Stage\s*(\d+)/i);
    return m ? Number(m[1]) : null;
  }).filter(Boolean));

  const missing = targetStages.filter((s) => !represented.has(s));
  return missing.map((stage) => ({
    stage: `Stage ${stage}`,
    priority: stage <= 2 ? 'high' : stage >= 7 ? 'medium' : 'low',
    rationale: stage <= 2
      ? 'Early-pipeline checkpoints are underrepresented and improve upstream prompt/brief conditioning.'
      : stage >= 7
        ? 'Late-stage checkpoint improves final gate and acceptance behavior coverage.'
        : 'Completes mid-pipeline checkpoint breadth.',
    suggestedExampleType: stage === 5 ? 'negative' : 'positive',
    suggestedPath: `examples/example-stage-${String(stage).padStart(2, '0')}-coverage.md`,
    templateStub: buildStageStub(stage)
  }));
}

function getGitHead() {
  try {
    return execSync('git rev-parse HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

function getPriorTrend() {
  try {
    if (!fs.existsSync(TRENDS_PATH)) return null;
    return JSON.parse(fs.readFileSync(TRENDS_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function getChangedFilesBetween(baseHead, currentHead) {
  if (!baseHead || !currentHead || baseHead === currentHead) return [];
  try {
    const out = execSync(`git diff --name-only ${baseHead}..${currentHead}`, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim();
    if (!out) return [];
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function findPreviousDistinctPoint(history, currentHead) {
  if (!Array.isArray(history) || history.length === 0) return null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].gitHead && history[i].gitHead !== currentHead) return history[i];
  }
  return null;
}

function checkBudget(rel, stageName, metricName, value, failMin, warnMin, remediationHint) {
  if (value < failMin) {
    addError(`${rel} ${stageName} budget fail: ${metricName}=${value} (<${failMin})`, {
      file: rel,
      issue: `${stageName} budget fail: ${metricName}`,
      action: remediationHint,
      priority: 'high'
    });
    return;
  }
  if (value < warnMin) {
    addWarning(`${rel} ${stageName} budget warning: ${metricName}=${value} (<${warnMin})`, {
      file: rel,
      issue: `${stageName} budget warning: ${metricName}`,
      action: remediationHint,
      priority: 'medium'
    });
  }
}

// File presence
for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(ROOT, rel))) {
    addError(`Missing required file: ${rel}`, {
      file: rel,
      issue: 'missing required file',
      action: `Create ${rel} or restore it from a previous commit.`,
      priority: 'high'
    });
  }
}

// SKILL/frontmatter sanity
const skill = read('SKILL.md');
if (!/^---\n[\s\S]*\n---\n/m.test(skill)) {
  addError('SKILL.md missing valid frontmatter block', {
    file: 'SKILL.md',
    issue: 'invalid frontmatter',
    action: 'Add a YAML frontmatter block bounded by --- at top of file.',
    priority: 'high'
  });
}
assertIncludes('SKILL.md', 'name: ralleh-poster', 'SKILL.md missing canonical skill name', {
  file: 'SKILL.md',
  issue: 'missing canonical skill name',
  action: 'Set frontmatter name to: name: ralleh-poster',
  priority: 'high'
});
assertIncludes('SKILL.md', 'metadata: {"openclaw"', 'SKILL.md missing single-line metadata.openclaw object', {
  file: 'SKILL.md',
  issue: 'missing metadata.openclaw object',
  action: 'Add single-line metadata JSON object: metadata: {"openclaw":{...}}',
  priority: 'high'
});

// Authority consistency
for (const rel of requiredAuthorityFiles) {
  assertIncludes('README.md', rel, `README.md missing authority reference: ${rel}`, {
    file: 'README.md',
    issue: `missing authority reference ${rel}`,
    action: `Add ${rel} to README authority chain section.`,
    priority: 'medium'
  });
  assertIncludes('SKILL.md', rel, `SKILL.md missing authority reference: ${rel}`, {
    file: 'SKILL.md',
    issue: `missing authority reference ${rel}`,
    action: `Add ${rel} to SKILL.md authority order.`,
    priority: 'medium'
  });
  assertIncludes('LLM_INSTRUCTIONS.md', rel, `LLM_INSTRUCTIONS.md missing authority reference: ${rel}`, {
    file: 'LLM_INSTRUCTIONS.md',
    issue: `missing authority reference ${rel}`,
    action: `Include ${rel} in LLM start sequence and authority order.`,
    priority: 'medium'
  });
}
assertIncludes('llm-reference.md', 'CORE_RULES.md', 'llm-reference.md missing CORE_RULES.md pointer', {
  file: 'llm-reference.md',
  issue: 'missing core rules pointer',
  action: 'Add CORE_RULES.md pointer in compact reference.',
  priority: 'medium'
});
assertIncludes('examples/README.md', 'FEW_SHOT_TEMPLATE.md', 'examples/README.md missing FEW_SHOT_TEMPLATE.md reference', {
  file: 'examples/README.md',
  issue: 'missing template reference',
  action: 'Add FEW_SHOT_TEMPLATE.md as required structure reference.',
  priority: 'medium'
});

// Model naming consistency
const noLegacy = ['WORKFLOW.md', 'TOOLS.md', 'STANDARDS.md', 'docs/ideogram-integration.md', 'examples/example-05-failure-typography.md'];
for (const rel of noLegacy) {
  const txt = read(rel);
  if (/\bideogram\/v2\b/.test(txt)) {
    addError(`${rel} contains legacy model name ideogram/v2`, {
      file: rel,
      issue: 'legacy model token ideogram/v2',
      action: 'Replace ideogram/v2 with litellm/ideogram-v4.',
      priority: 'high'
    });
  }
  if (/\blitellm\/ideogram-v2\b/.test(txt)) {
    addError(`${rel} contains legacy model name litellm/ideogram-v2`, {
      file: rel,
      issue: 'legacy model token litellm/ideogram-v2',
      action: 'Replace litellm/ideogram-v2 with litellm/ideogram-v4.',
      priority: 'high'
    });
  }
}
assertIncludes('TOOLS.md', 'litellm/ideogram-v4', 'TOOLS.md missing canonical Method B model litellm/ideogram-v4', {
  file: 'TOOLS.md',
  issue: 'missing method B model',
  action: 'Declare Method B model as litellm/ideogram-v4.',
  priority: 'high'
});
assertIncludes('TOOLS.md', 'fal/flux-pro', 'TOOLS.md missing canonical Method A model fal/flux-pro', {
  file: 'TOOLS.md',
  issue: 'missing method A model',
  action: 'Declare Method A model as fal/flux-pro.',
  priority: 'high'
});
assertIncludes('WORKFLOW.md', 'litellm/ideogram-v4', 'WORKFLOW.md missing canonical Method B model litellm/ideogram-v4', {
  file: 'WORKFLOW.md',
  issue: 'missing method B model',
  action: 'Update Stage 6 model selection to litellm/ideogram-v4.',
  priority: 'high'
});

// Example validation + weighted scoring + type/stage budgets
const examplesDir = path.join(ROOT, 'examples');
const exampleFiles = fs.readdirSync(examplesDir).filter((f) => /^example-\d{2}-.*\.md$/.test(f)).sort();
if (exampleFiles.length < 6) {
  addError(`Expected at least 6 example files, found ${exampleFiles.length}`, {
    file: 'examples/',
    issue: 'insufficient example count',
    action: 'Add enough example files to reach minimum of 6.',
    priority: 'high'
  });
}

const distinctRuleRefs = new Set();
const stageSet = new Set();
const improvementCandidates = [];
let totalScore = 0;

for (const name of exampleFiles) {
  const rel = path.join('examples', name);
  const txt = read(rel);

  let hasAllSections = true;
  for (const section of requiredExampleSections) {
    if (!txt.includes(section)) {
      hasAllSections = false;
      addError(`${rel} missing required section: ${section}`, {
        file: rel,
        issue: `missing section ${section}`,
        action: `Insert section heading exactly as required by FEW_SHOT_TEMPLATE.md: ${section}`,
        priority: 'high'
      });
    }
  }

  const outcome = extractMetaLine(txt, 'Outcome');
  const typeRaw = extractMetaLine(txt, 'Example Type');
  const type = normalizeExampleType(typeRaw);
  const stageRaw = extractMetaLine(txt, 'Primary Stage Checkpoint');
  const stageNum = extractStageNumber(stageRaw);
  const stageName = stageNum ? `Stage ${stageNum}` : 'Stage (unknown)';
  const rules = extractMetaLine(txt, 'Primary Rules Referenced');

  if (!outcome) addError(`${rel} missing Outcome metadata`, { file: rel, issue: 'missing outcome metadata', action: 'Add - Outcome: Success|Failure ...', priority: 'high' });
  if (!typeRaw) addError(`${rel} missing Example Type metadata`, { file: rel, issue: 'missing type metadata', action: 'Add - Example Type: Positive|Negative', priority: 'high' });
  if (!type) addError(`${rel} has invalid Example Type value: ${typeRaw || '(empty)'}`, { file: rel, issue: 'invalid example type', action: 'Use Example Type: Positive or Negative.', priority: 'high' });

  if (!stageRaw) {
    addError(`${rel} missing Primary Stage Checkpoint metadata`, {
      file: rel,
      issue: 'missing stage checkpoint metadata',
      action: 'Add Primary Stage Checkpoint in format: Stage X',
      priority: 'high'
    });
  }
  if (stageRaw && (!stageNum || stageNum < 1 || stageNum > 7)) {
    addError(`${rel} has invalid Primary Stage Checkpoint: ${stageRaw}`, {
      file: rel,
      issue: 'invalid stage checkpoint value',
      action: 'Use Primary Stage Checkpoint in format Stage 1 ... Stage 7.',
      priority: 'high'
    });
  }
  if (stageNum) stageSet.add(stageName);

  if (!rules) addError(`${rel} missing Primary Rules Referenced metadata`, { file: rel, issue: 'missing rules metadata', action: 'Add - Primary Rules Referenced with § references.', priority: 'high' });

  const refs = rules.match(/§\d+\.\d+/g) || [];
  refs.forEach((r) => distinctRuleRefs.add(r));
  if (refs.length < 3) {
    addError(`${rel} must reference at least 3 standards sections`, {
      file: rel,
      issue: 'low standards reference density',
      action: 'Add at least 3 explicit STANDARDS.md section references in metadata and critique mapping.',
      priority: 'high'
    });
  } else if (refs.length < 4) {
    addWarning(`${rel} warning: low standards reference density (<4)`, {
      file: rel,
      issue: 'standards coverage could be stronger',
      action: 'Add one more STANDARDS.md section reference to increase coverage depth.',
      priority: 'medium'
    });
  }

  const positiveMismatch = /positive/i.test(typeRaw) && !/success/i.test(outcome);
  const negativeMismatch = /negative/i.test(typeRaw) && !/failure/i.test(outcome);
  const metadataConsistent = !positiveMismatch && !negativeMismatch;

  if (positiveMismatch) addError(`${rel} has Example Type Positive but Outcome is not Success`, {
    file: rel,
    issue: 'metadata mismatch',
    action: 'Align Outcome and Example Type (Positive→Success, Negative→Failure).',
    priority: 'high'
  });
  if (negativeMismatch) addError(`${rel} has Example Type Negative but Outcome does not include Failure`, {
    file: rel,
    issue: 'metadata mismatch',
    action: 'Align Outcome and Example Type (Positive→Success, Negative→Failure).',
    priority: 'high'
  });

  const hasMethod = /Method\s*[AB]/.test(txt);
  if (!hasMethod) addError(`${rel} must explicitly specify typography Method A or Method B`, {
    file: rel,
    issue: 'missing typography method',
    action: 'Add explicit Method A or Method B declaration in strategy section.',
    priority: 'high'
  });

  const promptBlocks = getPromptBlocks(txt);
  if (promptBlocks.length === 0) {
    addError(`${rel} must include at least one \`\`\`text prompt block`, {
      file: rel,
      issue: 'missing prompt block',
      action: 'Add at least one fenced ```text prompt block.',
      priority: 'high'
    });
  }

  const bestKeywordHits = Math.max(0, ...promptBlocks.map((p) => antiSlopKeywords.filter((k) => p.includes(k)).length));
  if (bestKeywordHits < 2) {
    addError(`${rel} prompt quality too weak: expected at least 2 anti-slop keywords in a prompt block`, {
      file: rel,
      issue: 'anti-slop keyword density too low',
      action: 'Add anti-slop terms like "textless plate", "zero glow", "matte paper", "no photorealism".',
      priority: 'high'
    });
  } else if (bestKeywordHits < 4) {
    addWarning(`${rel} warning: prompt anti-slop density moderate (<4 keywords)`, {
      file: rel,
      issue: 'anti-slop keyword density moderate',
      action: 'Increase anti-slop constraints to at least 4 keywords for stronger prompt resilience.',
      priority: 'medium'
    });
  }

  const critiqueRows = countCritiqueRows(txt);
  if (critiqueRows < 3) {
    addError(`${rel} critique mapping must include at least 3 rule checks`, {
      file: rel,
      issue: 'critique mapping too shallow',
      action: 'Add at least 3 critique mapping table rows with standards references.',
      priority: 'high'
    });
  } else if (critiqueRows < 4) {
    addWarning(`${rel} warning: critique mapping depth moderate (<4 rows)`, {
      file: rel,
      issue: 'critique mapping depth moderate',
      action: 'Add one more critique check row to strengthen evaluative depth.',
      priority: 'medium'
    });
  }

  if (/negative/i.test(typeRaw) && !/fail/i.test(txt.toLowerCase())) {
    addError(`${rel} is Negative but does not explicitly show failure detection`, {
      file: rel,
      issue: 'negative case lacks failure signal',
      action: 'Add explicit failure verdict language (e.g., "Failed at Stage 5").',
      priority: 'high'
    });
  }

  // Stage-level quality budget enforcement
  const budget = stageBudgets[stageName] || stageBudgets.default;
  checkBudget(rel, stageName, 'standardsRefs', refs.length, budget.fail.refs, budget.warn.refs,
    `Increase standards references in ${rel} to meet ${stageName} budget (fail>=${budget.fail.refs}, warn>=${budget.warn.refs}).`);
  checkBudget(rel, stageName, 'critiqueRows', critiqueRows, budget.fail.critiqueRows, budget.warn.critiqueRows,
    `Increase critique mapping depth in ${rel} to meet ${stageName} budget (fail>=${budget.fail.critiqueRows}, warn>=${budget.warn.critiqueRows}).`);
  checkBudget(rel, stageName, 'antiSlopKeywordHits', bestKeywordHits, budget.fail.keywordHits, budget.warn.keywordHits,
    `Increase anti-slop keyword density in ${rel} to meet ${stageName} budget (fail>=${budget.fail.keywordHits}, warn>=${budget.warn.keywordHits}).`);

  const score = scoreExample({ hasAllSections, refsCount: refs.length, keywordHits: bestKeywordHits, critiqueRows, metadataConsistent, hasMethod });
  totalScore += score;

  if (score < 70) {
    addError(`${rel} quality score too low (${score}/100)`, {
      file: rel,
      issue: 'example quality score below fail threshold',
      action: 'Improve missing sections, standards refs, anti-slop terms, and critique depth to reach >=70.',
      priority: 'high'
    });
  } else if (score < 85) {
    addWarning(`${rel} quality score moderate (${score}/100)`, {
      file: rel,
      issue: 'example quality score in warning range',
      action: 'Raise standards refs and anti-slop density to target >=85.',
      priority: 'medium'
    });
  }

  // Example-type threshold enforcement
  if (type && exampleTypeThresholds[type]) {
    const t = exampleTypeThresholds[type];
    if (score < t.fail) {
      addError(`${rel} ${type} threshold fail: score ${score} < ${t.fail}`, {
        file: rel,
        issue: `${type} threshold fail`,
        action: `Raise ${type} example quality score to at least ${t.fail}.`,
        priority: 'high'
      });
    } else if (score < t.warn) {
      addWarning(`${rel} ${type} threshold warning: score ${score} < ${t.warn}`, {
        file: rel,
        issue: `${type} threshold warning`,
        action: `Improve ${type} example quality score toward ${t.warn}+ for target quality budget.`,
        priority: 'medium'
      });
    }
  }

  const candidate = buildImprovementCandidate({
    rel,
    type,
    stageName,
    score,
    budget,
    refsCount: refs.length,
    keywordHits: bestKeywordHits,
    critiqueRows
  });
  if (candidate) improvementCandidates.push(candidate);

  report.examples.push({
    file: rel,
    score,
    type,
    stage: stageName,
    thresholds: {
      type: type ? exampleTypeThresholds[type] : null,
      stage: budget
    },
    metrics: {
      standardsRefs: refs.length,
      antiSlopKeywordHits: bestKeywordHits,
      critiqueRows,
      hasMethod,
      metadataConsistent
    }
  });
}

if (distinctRuleRefs.size < 8) {
  addError(`Example corpus rule coverage too narrow: only ${distinctRuleRefs.size} distinct standards refs found (min 8)`, {
    file: 'examples/',
    issue: 'corpus standards coverage too narrow',
    action: 'Increase diversity of § references across examples to at least 8 distinct sections.',
    priority: 'high'
  });
} else if (distinctRuleRefs.size < 10) {
  addWarning(`Example corpus rule coverage moderate: ${distinctRuleRefs.size} distinct standards refs`, {
    file: 'examples/',
    issue: 'corpus standards coverage moderate',
    action: 'Expand examples to reference 10+ distinct standards sections.',
    priority: 'medium'
  });
}

if (stageSet.size < 2) {
  addWarning(`Stage checkpoint diversity low: only ${stageSet.size} unique stage(s) represented`, {
    file: 'examples/',
    issue: 'low stage checkpoint diversity',
    action: 'Add examples anchored to additional stage checkpoints for broader training coverage.',
    priority: 'medium'
  });
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
    if (!fs.existsSync(resolved)) {
      addError(`${path.relative(ROOT, file)} has broken local link: ${raw}`, {
        file: path.relative(ROOT, file),
        issue: 'broken local markdown link',
        action: `Fix or remove broken link target: ${raw}`,
        priority: 'high'
      });
    }
  }
}

const overallScore = exampleFiles.length ? Math.round(totalScore / exampleFiles.length) : 0;
if (overallScore < 75) {
  addError(`Overall quality score too low (${overallScore}/100)`, {
    file: 'examples/',
    issue: 'overall corpus score below fail threshold',
    action: 'Improve low-scoring examples until corpus average is >=75.',
    priority: 'high'
  });
} else if (overallScore < 88) {
  addWarning(`Overall quality score moderate (${overallScore}/100)`, {
    file: 'examples/',
    issue: 'overall corpus score in warning range',
    action: 'Target corpus average >=88 by improving medium-scoring examples.',
    priority: 'medium'
  });
}

// Trend tracking + commit-range diff hints
const previous = getPriorTrend();
const head = getGitHead();
const trendPoint = {
  generatedAt: report.generatedAt,
  gitHead: head,
  overallScore,
  errors: report.errors.length,
  warnings: report.warnings.length,
  examples: exampleFiles.length,
  distinctStandardsRefs: distinctRuleRefs.size
};

let trends = { history: [], regressionHints: [] };
if (previous && Array.isArray(previous.history)) trends = previous;
if (!Array.isArray(trends.regressionHints)) trends.regressionHints = [];

const previousDistinct = findPreviousDistinctPoint(trends.history, head);
const delta = previousDistinct ? overallScore - previousDistinct.overallScore : null;
const changedFiles = previousDistinct ? getChangedFilesBetween(previousDistinct.gitHead, head) : [];

if (delta !== null && delta < 0) {
  addWarning(`Quality score regressed by ${Math.abs(delta)} point(s) from previous distinct commit`, {
    file: 'reports/validation-trends.json',
    issue: 'quality regression',
    action: 'Review changed files and low-scoring examples to recover prior score.',
    priority: 'medium'
  });

  const likelyCulprits = [];
  const lowExamples = [...report.examples].sort((a, b) => a.score - b.score).slice(0, 3).map((e) => e.file);
  for (const f of changedFiles) {
    if (f.startsWith('examples/') || f.startsWith('scripts/') || f === 'README.md' || f.startsWith('docs/')) {
      likelyCulprits.push(f);
    }
  }

  trends.regressionHints.push({
    generatedAt: report.generatedAt,
    fromHead: previousDistinct.gitHead,
    toHead: head,
    delta,
    changedFiles,
    likelyCulprits: Array.from(new Set(likelyCulprits)).slice(0, 10),
    lowestScoringExamples: lowExamples
  });

  if (trends.regressionHints.length > 30) {
    trends.regressionHints = trends.regressionHints.slice(-30);
  }
}

trendPoint.diffFromPreviousDistinct = {
  fromHead: previousDistinct?.gitHead || null,
  toHead: head,
  delta,
  changedFilesCount: changedFiles.length
};

trends.history.push(trendPoint);
if (trends.history.length > 50) trends.history = trends.history.slice(-50);

report.remediation = Array.from(remediationMap.values())
  .sort((a, b) => (a.priority === b.priority ? (a.file || '').localeCompare(b.file || '') : (a.priority === 'high' ? -1 : 1)));

report.improvementPlan = improvementCandidates
  .sort((a, b) => b.estimatedImpactPoints - a.estimatedImpactPoints || a.currentScore - b.currentScore)
  .slice(0, 8);

report.stageExpansionPlan = buildStageExpansionPlan(stageSet).slice(0, 7);

if (stageCoverageLock.enabled && report.stageExpansionPlan.length > 0) {
  const missing = report.stageExpansionPlan.map((s) => s.stage).join(', ');
  addError(`Stage coverage lock failed: missing required checkpoints (${missing})`, {
    file: 'examples/',
    issue: 'stage coverage lock failed',
    action: 'Add or promote examples until Stage 1..7 are all represented in canonical example files.',
    priority: 'high'
  });
}

report.summary = {
  examples: exampleFiles.length,
  distinctStandardsRefs: distinctRuleRefs.size,
  representedStages: Array.from(stageSet).sort(),
  missingStages: report.stageExpansionPlan.map((s) => s.stage),
  overallScore,
  errors: report.errors.length,
  warnings: report.warnings.length,
  trendDeltaFromPrevious: delta,
  previousDistinctHead: previousDistinct?.gitHead || null,
  changedFilesSincePreviousDistinct: changedFiles.length
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
fs.writeFileSync(TRENDS_PATH, JSON.stringify(trends, null, 2));

if (report.errors.length > 0) {
  console.error(`❌ Validation failed with ${report.errors.length} error(s) and ${report.warnings.length} warning(s).`);
  console.error(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.error(`Trends: ${path.relative(ROOT, TRENDS_PATH)}`);
  process.exit(1);
}

console.log(`✅ Validation passed (score: ${overallScore}/100, warnings: ${report.warnings.length})`);
if (delta !== null) {
  const sign = delta > 0 ? '+' : '';
  console.log(`Trend delta from previous distinct commit: ${sign}${delta}`);
  console.log(`Changed files since previous distinct commit: ${changedFiles.length}`);
}
if (report.improvementPlan.length > 0) {
  const top = report.improvementPlan[0];
  console.log(`Top next-best improvement: ${top.file} (+~${top.estimatedImpactPoints} impact)`);
}
if (report.stageExpansionPlan.length > 0) {
  const topStage = report.stageExpansionPlan[0];
  console.log(`Top stage expansion target: ${topStage.stage} (${topStage.priority})`);
}
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
console.log(`Trends: ${path.relative(ROOT, TRENDS_PATH)}`);
