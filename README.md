# Forecasting Frontier AI Progress

Interactive demo of a college project with two finished tracks. Every count, rate, and error on the page is taken from the submitted report and the score-forecast result tables. The app does not refit a model and does not download a new data file.

**Release track.** Will OpenAI, Google, Meta, Alibaba, Anthropic, DeepSeek, or xAI publish an Epoch-notable model in the next 3, 6, or 12 months? The source file is Epoch’s all-models CSV dated 8 October 2026, downloaded 10 October 2026, with latest publication date 2026-09-30. Seven labs contribute 215 notable models from January 2023. No classifier was trained: the labels are too one-sided. Always-yes beat or tied per-lab frequency on accuracy at every horizon.

**Score track.** Forecast a later score on one benchmark from earlier rows only. The split is chronological. Metrics are MAE, RMSE, and R². Baselines are the last observed score and a historical linear trend. Models are linear regression, random forest, and gradient boosting. Sixteen benchmarks are modeled. Two machine-learning wins are material: ProofBench (linear regression, test MAE 0.1328, margin 0.111) and Aider polyglot (gradient boosting, test MAE 10.09 percent, margin 6.59). Six other adopted margins are under 0.01. Eight benchmarks are won by a baseline.

## Run locally

```bash
npm install
npm run dev
```

The dev server listens on port **3847** and host `0.0.0.0`. Open [http://localhost:3847](http://localhost:3847).

`npm run build` then `npm start` serves the production build on the same port.

## What the page shows

1. The question, the two tracks, and the conclusion, including the always-yes baseline.
2. The lab mix of the 215 notable releases, positive rates by horizon, and always-yes against frequency. A horizon switcher (3, 6, 12 months) updates the accuracy chart, the Brier chart, and the per-lab bars. Hover a bar for the value.
3. The 16 modeled benchmarks, filterable by who won (baseline, any model, material win, tiny margin) and by name. Select a row to plot that benchmark’s test MAE. ProofBench and Aider polyglot are marked as the material wins.
4. A short method note: chronological splits, no leakage from same-day or future rows, and public Epoch data.

If a filter matches nothing, the table is replaced by an empty state with a control that restores all 16 benchmarks.
