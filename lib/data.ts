/**
 * Figures copied from the submitted report and the score-forecast result tables.
 * Part A: Epoch file dated 8 October 2026, downloaded 10 October 2026.
 * Part B: winner-by-benchmark.csv and the results table in the score-forecast report.
 * This module does not recompute a model. Display strings for the published
 * summary metrics are the strings printed in those tables.
 */

export const study = {
  fileDate: "8 October 2026",
  downloaded: "10 October 2026",
  latestPublication: "2026-09-30",
  epochRows: 3626,
  notableModels: 215,
  scoreRows: 2523,
  scoreStart: "2023-02-24",
  scoreEnd: "2026-11-18",
  modeledBenchmarks: 16,
  descriptiveBenchmarks: 14,
  multimodalityBenchmarks: 6,
  multimodalityRows: 56,
} as const

export const notableLabs = [
  { lab: "OpenAI", count: 57 },
  { lab: "Google", count: 53 },
  { lab: "Meta", count: 32 },
  { lab: "Alibaba", count: 32 },
  { lab: "Anthropic", count: 22 },
  { lab: "DeepSeek", count: 10 },
  { lab: "xAI", count: 9 },
] as const

export type HorizonId = "3" | "6" | "12"

export type LabRate = {
  lab: string
  positive: number
  negative: number
  label: string
}

export type Horizon = {
  id: HorizonId
  label: string
  fullRows: number
  positives: number
  positiveLabel: string
  rate: string
  cutoffs: number
  scoredRows: number
  alwaysYes: { correct: number; label: string; brier: string; brierValue: number }
  frequency: { correct: number; label: string; brier: string; brierValue: number }
  cadence: string
  finding: string
  labs: LabRate[]
}

export const horizons: Horizon[] = [
  {
    id: "3",
    label: "3 months",
    fullRows: 294,
    positives: 220,
    positiveLabel: "220/294",
    rate: "74.8%",
    cutoffs: 42,
    scoredRows: 252,
    alwaysYes: {
      correct: 193,
      label: "193/252 (76.6%)",
      brier: "0.2341",
      brierValue: 0.2341,
    },
    frequency: {
      correct: 189,
      label: "189/252 (75.0%)",
      brier: "0.1831",
      brierValue: 0.1831,
    },
    cadence:
      "Cadence is scored only when a lab has two past dates. It is right on 159 of 222 rows, Brier 0.2237, with 30 rows unscored.",
    finding:
      "Always-yes is the better hard call: 193 of 252 scored rows, against 189 of 252 for per-lab frequency. Frequency has the better Brier, 0.1831 against 0.2341. OpenAI and Google are positive on 41 of 42 cutoffs, so a fitted classifier would mostly rediscover a high yes rate and two labs that almost never say no. No classifier was trained.",
    labs: [
      { lab: "OpenAI", positive: 41, negative: 1, label: "41/42 (97.6%)" },
      { lab: "Google", positive: 41, negative: 1, label: "41/42 (97.6%)" },
      { lab: "Alibaba", positive: 36, negative: 6, label: "36/42 (85.7%)" },
      { lab: "Anthropic", positive: 32, negative: 10, label: "32/42 (76.2%)" },
      { lab: "Meta", positive: 32, negative: 10, label: "32/42 (76.2%)" },
      { lab: "DeepSeek", positive: 20, negative: 22, label: "20/42 (47.6%)" },
      { lab: "xAI", positive: 18, negative: 24, label: "18/42 (42.9%)" },
    ],
  },
  {
    id: "6",
    label: "6 months",
    fullRows: 273,
    positives: 249,
    positiveLabel: "249/273",
    rate: "91.2%",
    cutoffs: 39,
    scoredRows: 231,
    alwaysYes: {
      correct: 218,
      label: "218/231 (94.4%)",
      brier: "0.0563",
      brierValue: 0.0563,
    },
    frequency: {
      correct: 201,
      label: "201/231 (87.0%)",
      brier: "0.1135",
      brierValue: 0.1135,
    },
    cadence:
      "Cadence is right on 194 of 201 scored rows, Brier 0.0625, with 30 rows unscored.",
    finding:
      "Always-yes beats frequency on both the hard call and the Brier score: 218 of 231 rows and Brier 0.0563, against 201 of 231 and Brier 0.1135. OpenAI, Google, and Alibaba are constant yes on the full grid.",
    labs: [
      { lab: "OpenAI", positive: 39, negative: 0, label: "39/39 (100%)" },
      { lab: "Google", positive: 39, negative: 0, label: "39/39 (100%)" },
      { lab: "Alibaba", positive: 39, negative: 0, label: "39/39 (100%)" },
      { lab: "Anthropic", positive: 37, negative: 2, label: "37/39 (94.9%)" },
      { lab: "Meta", positive: 38, negative: 1, label: "38/39 (97.4%)" },
      { lab: "DeepSeek", positive: 27, negative: 12, label: "27/39 (69.2%)" },
      { lab: "xAI", positive: 30, negative: 9, label: "30/39 (76.9%)" },
    ],
  },
  {
    id: "12",
    label: "12 months",
    fullRows: 231,
    positives: 225,
    positiveLabel: "225/231",
    rate: "97.4%",
    cutoffs: 33,
    scoredRows: 147,
    alwaysYes: {
      correct: 147,
      label: "147/147 (100%)",
      brier: "0",
      brierValue: 0,
    },
    frequency: {
      correct: 136,
      label: "136/147 (92.5%)",
      brier: "0.0670",
      brierValue: 0.067,
    },
    cadence:
      "Cadence is right on 130 of 130 rows, Brier 0.0005, with 17 rows unscored.",
    finding:
      "Every scored label is positive. Always-yes is right on 147 of 147 rows and has Brier 0. Frequency is worse, 136 of 147, Brier 0.0670, because DeepSeek's early zeros keep the expanding rate below one half after the label has switched to yes. DeepSeek's six full-grid negatives are January through June 2023, before scoring begins. A perfect score on a grid with no negatives describes the base rate.",
    labs: [
      { lab: "OpenAI", positive: 33, negative: 0, label: "33/33 (100%)" },
      { lab: "Google", positive: 33, negative: 0, label: "33/33 (100%)" },
      { lab: "Alibaba", positive: 33, negative: 0, label: "33/33 (100%)" },
      { lab: "Anthropic", positive: 33, negative: 0, label: "33/33 (100%)" },
      { lab: "Meta", positive: 33, negative: 0, label: "33/33 (100%)" },
      { lab: "DeepSeek", positive: 27, negative: 6, label: "27/33 (81.8%)" },
      { lab: "xAI", positive: 33, negative: 0, label: "33/33 (100%)" },
    ],
  },
]

export type ScoreUnit = "proportion" | "percent" | "minutes"

export type MethodKey =
  | "baseline_last_observed"
  | "baseline_linear_trend"
  | "linear_regression"
  | "random_forest"
  | "gradient_boosting"

export const methodOrder: MethodKey[] = [
  "baseline_last_observed",
  "baseline_linear_trend",
  "linear_regression",
  "random_forest",
  "gradient_boosting",
]

export const methodLabels: Record<MethodKey, string> = {
  baseline_last_observed: "Last observed score",
  baseline_linear_trend: "Historical linear trend",
  linear_regression: "Linear regression",
  random_forest: "Random forest",
  gradient_boosting: "Gradient boosting",
}

export type Reading = "baseline" | "tiny" | "material"

export type BenchmarkResult = {
  name: string
  capability: "reasoning" | "coding" | "long context"
  unit: ScoreUnit
  unitLabel: string
  testWindow: string
  nTrain: number
  nTest: number
  winner: MethodKey
  mae: Record<MethodKey, number>
  reportMae: string
  reportMargin: string
  reportRmse: string
  reportR2: string
  reading: Reading
  caveat: string
}

export const benchmarks: BenchmarkResult[] = [
  {
    name: "ARC-AGI",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-28 to 2026-11-17",
    nTrain: 239,
    nTest: 40,
    winner: "baseline_linear_trend",
    mae: {
      linear_regression: 0.13209494020112306,
      random_forest: 0.17438172969414978,
      gradient_boosting: 0.16837903847038527,
      baseline_last_observed: 0.20662499999999998,
      baseline_linear_trend: 0.097896055024743,
    },
    reportMae: "0.0979",
    reportMargin: "-0.0342",
    reportRmse: "0.1740",
    reportR2: "0.022",
    reading: "baseline",
    caveat:
      "Historical linear trend has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "ARC-AGI-2",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-28 to 2026-11-17",
    nTrain: 226,
    nTest: 38,
    winner: "gradient_boosting",
    mae: {
      linear_regression: 0.25323150813059053,
      random_forest: 0.2704634000150987,
      gradient_boosting: 0.23939082867180228,
      baseline_last_observed: 0.31144005847953227,
      baseline_linear_trend: 0.23967352934788996,
    },
    reportMae: "0.2394",
    reportMargin: "0.0003",
    reportRmse: "0.3215",
    reportR2: "-0.355",
    reading: "tiny",
    caveat:
      "Gradient boosting is adopted because it beats both baselines. The margin is 0.0003, under 0.01. This is a lowest-MAE win, not a finding.",
  },
  {
    name: "CritPt",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-22 to 2026-11-10",
    nTrain: 142,
    nTest: 33,
    winner: "linear_regression",
    mae: {
      linear_regression: 0.08261061605088992,
      random_forest: 0.08905149836458995,
      gradient_boosting: 0.09817996832371789,
      baseline_last_observed: 0.1042424242424241,
      baseline_linear_trend: 0.08624506601198867,
    },
    reportMae: "0.0826",
    reportMargin: "0.0036",
    reportRmse: "0.0996",
    reportR2: "-0.079",
    reading: "tiny",
    caveat:
      "Linear regression is adopted. The margin is 0.0036, under 0.01. This is a lowest-MAE win, not a finding.",
  },
  {
    name: "GPQA diamond",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-06-09 to 2026-11-18",
    nTrain: 210,
    nTest: 52,
    winner: "baseline_linear_trend",
    mae: {
      linear_regression: 0.058438859307630715,
      random_forest: 0.0845961052267709,
      gradient_boosting: 0.07290117307580263,
      baseline_last_observed: 0.04943667443667444,
      baseline_linear_trend: 0.04510301528022646,
    },
    reportMae: "0.0451",
    reportMargin: "-0.0133",
    reportRmse: "0.0687",
    reportR2: "0.001",
    reading: "baseline",
    caveat:
      "Historical linear trend has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "Humanity's Last Exam",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-03-03 to 2026-10-07",
    nTrain: 35,
    nTest: 9,
    winner: "linear_regression",
    mae: {
      linear_regression: 0.09370389676028001,
      random_forest: 0.16087822785075015,
      gradient_boosting: 0.11756715721209919,
      baseline_last_observed: 0.1738222222222222,
      baseline_linear_trend: 0.10221592219432302,
    },
    reportMae: "0.0937",
    reportMargin: "0.0085",
    reportRmse: "0.1178",
    reportR2: "0.126",
    reading: "tiny",
    caveat:
      "Linear regression is adopted. The margin is 0.0085, under 0.01. This is a lowest-MAE win, not a finding.",
  },
  {
    name: "MATH level 5",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2025-04-29 to 2025-10-15",
    nTrain: 64,
    nTest: 15,
    winner: "baseline_last_observed",
    mae: {
      linear_regression: 0.1383736889605326,
      random_forest: 0.10249395091766592,
      gradient_boosting: 0.09179239823972922,
      baseline_last_observed: 0.07509308271369387,
      baseline_linear_trend: 0.08318505936779799,
    },
    reportMae: "0.0751",
    reportMargin: "-0.0167",
    reportRmse: "0.1185",
    reportR2: "-1.275",
    reading: "baseline",
    caveat:
      "Last observed score has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "MMLU",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2024-09-19 to 2024-12-26",
    nTrain: 72,
    nTest: 17,
    winner: "baseline_linear_trend",
    mae: {
      linear_regression: 0.24165762899480842,
      random_forest: 0.11083137486890575,
      gradient_boosting: 0.16461956798777272,
      baseline_last_observed: 0.08905882352941175,
      baseline_linear_trend: 0.05599609302827973,
    },
    reportMae: "0.0560",
    reportMargin: "-0.0548",
    reportRmse: "0.0745",
    reportR2: "0.090",
    reading: "baseline",
    caveat:
      "Historical linear trend has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "OTIS Mock AIME 2024-2025",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-07-08 to 2026-11-18",
    nTrain: 205,
    nTest: 51,
    winner: "baseline_linear_trend",
    mae: {
      linear_regression: 0.0998962786060659,
      random_forest: 0.16641946109797698,
      gradient_boosting: 0.11683862803649082,
      baseline_last_observed: 0.08589324618736384,
      baseline_linear_trend: 0.07987440210094696,
    },
    reportMae: "0.0799",
    reportMargin: "-0.0200",
    reportRmse: "0.1426",
    reportR2: "0.042",
    reading: "baseline",
    caveat:
      "Historical linear trend has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "ProofBench",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-09 to 2026-11-09",
    nTrain: 38,
    nTest: 10,
    winner: "linear_regression",
    mae: {
      linear_regression: 0.13284746851203103,
      random_forest: 0.22435122787640954,
      gradient_boosting: 0.20419051497123825,
      baseline_last_observed: 0.281,
      baseline_linear_trend: 0.24390832011531072,
    },
    reportMae: "0.1328",
    reportMargin: "0.1111",
    reportRmse: "0.1877",
    reportR2: "0.397",
    reading: "material",
    caveat:
      "Linear regression is a material win. Test MAE 0.1328. The margin over the stronger baseline is 0.111, printed as 0.1111 in the results table. Both official baselines sit higher: last observed score 0.281 and historical linear trend 0.2439.",
  },
  {
    name: "SimpleBench",
    capability: "reasoning",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-01 to 2026-11-18",
    nTrain: 82,
    nTest: 21,
    winner: "linear_regression",
    mae: {
      linear_regression: 0.09389413988552724,
      random_forest: 0.16587672387561594,
      gradient_boosting: 0.14682130313487077,
      baseline_last_observed: 0.1379047619047619,
      baseline_linear_trend: 0.09756631828409781,
    },
    reportMae: "0.0939",
    reportMargin: "0.0037",
    reportRmse: "0.1109",
    reportR2: "-0.346",
    reading: "tiny",
    caveat:
      "Linear regression is adopted. The margin is 0.0037, under 0.01. This is a lowest-MAE win, not a finding.",
  },
  {
    name: "Aider polyglot",
    capability: "coding",
    unit: "percent",
    unitLabel: "percent",
    testWindow: "2025-06-10 to 2025-09-29",
    nTrain: 41,
    nTest: 11,
    winner: "gradient_boosting",
    mae: {
      linear_regression: 24.95777810893861,
      random_forest: 16.11738948866956,
      gradient_boosting: 10.088240933820973,
      baseline_last_observed: 20.690909090909095,
      baseline_linear_trend: 16.682572190295115,
    },
    reportMae: "10.09",
    reportMargin: "6.594",
    reportRmse: "13.10",
    reportR2: "0.332",
    reading: "material",
    caveat:
      "Gradient boosting is a material win. Test MAE 10.09 percent. The margin over the stronger baseline is 6.59 percentage points, printed as 6.594 in the results table. On the 9 test rows from labs seen in training, the model MAE is 9.831 and the stronger baseline is 18.24, so the model stays ahead. Two test rows are from xAI, which has no training row on this benchmark.",
  },
  {
    name: "DeepSWE",
    capability: "coding",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-08-13 to 2026-09-03",
    nTrain: 47,
    nTest: 10,
    winner: "baseline_last_observed",
    mae: {
      linear_regression: 0.4120070881100343,
      random_forest: 0.12048960087738925,
      gradient_boosting: 0.1380541872647044,
      baseline_last_observed: 0.04285254258024011,
      baseline_linear_trend: 0.07932448857421084,
    },
    reportMae: "0.0429",
    reportMargin: "-0.0776",
    reportRmse: "0.0557",
    reportR2: "0.151",
    reading: "baseline",
    caveat:
      "Last observed score has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "METR time horizon",
    capability: "coding",
    unit: "minutes",
    unitLabel: "minutes",
    testWindow: "2025-11-24 to 2026-04-07",
    nTrain: 30,
    nTest: 8,
    winner: "baseline_last_observed",
    mae: {
      linear_regression: 204.96364118469484,
      random_forest: 313.58087342715163,
      gradient_boosting: 310.9064862109903,
      baseline_last_observed: 168.395542125,
      baseline_linear_trend: 285.0861253164398,
    },
    reportMae: "168.4",
    reportMargin: "-36.57",
    reportRmse: "283.9",
    reportR2: "-0.268",
    reading: "baseline",
    caveat:
      "Last observed score has the lowest test MAE, 168.4 minutes. The held-out model forecast is not adopted. This error is in minutes and is not compared with proportion or percent losses.",
  },
  {
    name: "SciCode",
    capability: "coding",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-09-29 to 2026-11-10",
    nTrain: 135,
    nTest: 21,
    winner: "baseline_linear_trend",
    mae: {
      linear_regression: 0.039071293786413275,
      random_forest: 0.0428915397355362,
      gradient_boosting: 0.04685651122572306,
      baseline_last_observed: 0.07754629629629625,
      baseline_linear_trend: 0.03794652531307598,
    },
    reportMae: "0.0379",
    reportMargin: "-0.0011",
    reportRmse: "0.0528",
    reportR2: "-0.041",
    reading: "baseline",
    caveat:
      "Historical linear trend has the lowest test MAE. The held-out model forecast is not adopted.",
  },
  {
    name: "Terminal-Bench",
    capability: "coding",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2026-02-17 to 2026-04-23",
    nTrain: 120,
    nTest: 17,
    winner: "gradient_boosting",
    mae: {
      linear_regression: 0.2817046238874416,
      random_forest: 0.15212650850531936,
      gradient_boosting: 0.13579934072589525,
      baseline_last_observed: 0.24296981714035298,
      baseline_linear_trend: 0.14047528643749566,
    },
    reportMae: "0.1358",
    reportMargin: "0.0047",
    reportRmse: "0.1876",
    reportR2: "0.198",
    reading: "tiny",
    caveat:
      "Gradient boosting is adopted on the full test set, with margin 0.0047, under 0.01. That small win reverses on labs seen in training. On the other 13 test rows, the model MAE is 0.1030 and the stronger baseline is 0.0637. Four test rows are from Alibaba and xAI, which have no training row on this benchmark. The official winner stays the full pre-specified test set.",
  },
  {
    name: "Fiction.LiveBench (16k tokens)",
    capability: "long context",
    unit: "proportion",
    unitLabel: "proportion",
    testWindow: "2025-08-07 to 2025-09-29",
    nTrain: 35,
    nTest: 9,
    winner: "random_forest",
    mae: {
      linear_regression: 0.3501948937808794,
      random_forest: 0.16220338897061323,
      gradient_boosting: 0.30001865825743235,
      baseline_last_observed: 0.20666666666666667,
      baseline_linear_trend: 0.16284572679501536,
    },
    reportMae: "0.1622",
    reportMargin: "0.0006",
    reportRmse: "0.1902",
    reportR2: "-0.074",
    reading: "tiny",
    caveat:
      "Random forest is adopted. The margin is 0.0006, under 0.01. This is a lowest-MAE win, not a finding.",
  },
]

export const readingLabel: Record<Reading, string> = {
  baseline: "Baseline won",
  tiny: "Tiny margin",
  material: "Material win",
}

export function formatMae(value: number, unit: ScoreUnit): string {
  if (unit === "minutes") return value.toFixed(1)
  if (unit === "percent") return value.toFixed(2)
  return value.toFixed(4)
}

function assertStudy(): void {
  const labSum = notableLabs.reduce((sum, lab) => sum + lab.count, 0)
  if (labSum !== study.notableModels) {
    throw new Error(`Notable lab counts sum to ${labSum}, expected 215.`)
  }

  for (const horizon of horizons) {
    const positiveSum = horizon.labs.reduce((sum, lab) => sum + lab.positive, 0)
    const rowSum = horizon.labs.reduce(
      (sum, lab) => sum + lab.positive + lab.negative,
      0
    )
    if (positiveSum !== horizon.positives) {
      throw new Error(`${horizon.label} positives sum to ${positiveSum}.`)
    }
    if (rowSum !== horizon.fullRows) {
      throw new Error(`${horizon.label} grid sums to ${rowSum}.`)
    }
    if (horizon.labs.length !== 7) {
      throw new Error(`${horizon.label} is missing a lab.`)
    }
  }

  if (benchmarks.length !== study.modeledBenchmarks) {
    throw new Error(`Expected 16 benchmarks, found ${benchmarks.length}.`)
  }

  const counts: Record<Reading, number> = { baseline: 0, tiny: 0, material: 0 }
  for (const benchmark of benchmarks) {
    counts[benchmark.reading] += 1
    const formatted = formatMae(benchmark.mae[benchmark.winner], benchmark.unit)
    if (formatted !== benchmark.reportMae) {
      throw new Error(
        `${benchmark.name} winner MAE formats as ${formatted}, table prints ${benchmark.reportMae}.`
      )
    }
  }

  if (counts.baseline !== 8 || counts.tiny !== 6 || counts.material !== 2) {
    throw new Error(`Reading counts ${JSON.stringify(counts)} do not match the report.`)
  }

  const material = benchmarks
    .filter((benchmark) => benchmark.reading === "material")
    .map((benchmark) => benchmark.name)
  if (material.join("|") !== "ProofBench|Aider polyglot") {
    throw new Error(`Material wins drifted: ${material.join(", ")}.`)
  }
}

assertStudy()
