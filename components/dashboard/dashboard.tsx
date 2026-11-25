"use client"

import { useMemo, useState } from "react"

import { CategoryChart, MaeChart } from "@/components/dashboard/charts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  benchmarks,
  formatMae,
  horizons,
  methodLabels,
  methodOrder,
  notableLabs,
  readingLabel,
  study,
  type BenchmarkResult,
  type HorizonId,
  type Reading,
} from "@/lib/data"
import { cn } from "cn"

const filterItems = [
  { value: "all", label: "All modeled benchmarks" },
  { value: "baseline", label: "Baseline won" },
  { value: "model", label: "Model won" },
  { value: "material", label: "Material model wins" },
  { value: "tiny", label: "Tiny model wins" },
] as const

type FilterValue = (typeof filterItems)[number]["value"]

const labConfig = {
  count: { label: "Notable models", color: "var(--chart-1)" },
}

const rateConfig = {
  rate: { label: "Positive rate (%)", color: "var(--chart-1)" },
}

const accuracyConfig = {
  correct: { label: "Correct hard calls", color: "var(--chart-1)" },
}

const brierConfig = {
  brier: { label: "Brier score", color: "var(--chart-2)" },
}

const labRateConfig = {
  positive: { label: "Positive windows", color: "var(--chart-1)" },
  negative: { label: "Negative windows", color: "var(--chart-4)" },
}

function readingVariant(reading: Reading): "default" | "secondary" | "outline" {
  if (reading === "material") return "default"
  if (reading === "baseline") return "secondary"
  return "outline"
}

export function Dashboard() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-col">
            <p className="font-heading text-sm font-medium">
              Forecasting Frontier AI Progress
            </p>
            <p className="text-xs text-muted-foreground">
              College project demo · submitted figures only
            </p>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Sections">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<a href="#question" />}
            >
              Question
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<a href="#releases" />}
            >
              Releases
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<a href="#scores" />}
            >
              Scores
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<a href="#method" />}
            >
              Method
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8">
        <Opening />
        <ReleaseTrack />
        <ScoreTrack />
        <MethodNote />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground">
          <p>
            Release counts use Epoch AI, “Data on AI models,” the all-models
            file dated {study.fileDate}, downloaded {study.downloaded}. Epoch’s
            data is CC BY.
          </p>
          <p>
            Score errors use the chronological holdout on the public benchmark
            table ({study.scoreRows.toLocaleString()} rows, {study.scoreStart}{" "}
            through {study.scoreEnd}). This page does not refit a model and
            does not download a new file.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Opening() {
  return (
    <section id="question" className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Two finished tracks
        </p>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          Can public records say what the frontier will do next?
        </h1>
        <p className="text-base leading-relaxed text-pretty">
          The project splits that question in two. One track asks whether a lab
          publishes an Epoch-notable model. The other asks whether a later
          score on one benchmark is close to a simple forecast from earlier
          rows. The honest result is that the baseline is hard to beat, and on
          releases no classifier was trained.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Release track</CardTitle>
            <CardDescription>
              A yes or no label for each lab and month
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              Will OpenAI, Google, Meta, Alibaba, Anthropic, DeepSeek, or xAI
              publish at least one Epoch-notable model in the next 3, 6, or 12
              months? The file is dated {study.fileDate} and was downloaded{" "}
              {study.downloaded}. The latest publication date in it is{" "}
              {study.latestPublication}. From January 2023 those labs
              contribute {study.notableModels} notable models.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Score track</CardTitle>
            <CardDescription>
              One benchmark, earlier rows only
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              For a later row, how close can linear regression, a random
              forest, or gradient boosting come to the reported score? The
              split is chronological. The clock is the publication or
              evaluation date, so the test is retrospective. {study.modeledBenchmarks}{" "}
              benchmarks are modeled. Multimodality is descriptive only.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What a two-minute reading should take away</CardTitle>
          <CardDescription>
            The claims below are the submitted results, including the baseline
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm leading-relaxed">
          <p>
            On releases, the labels are too one-sided for a classifier. No
            logistic regression, forest, or booster is fit. Always-yes beat or
            tied per-lab frequency on accuracy at every horizon. At three
            months the full grid is <strong>220/294</strong> positive (74.8%),
            and always-yes is right on <strong>193/252</strong> scored rows.
            Frequency is right on 189/252. Frequency does have the better Brier
            there, 0.1831 against 0.2341. At six months always-yes is right on
            218/231. At twelve months the scored grid is 147 positives out of
            147, and always-yes has Brier 0.
          </p>
          <p>
            On scores, a baseline has the lowest test MAE on 8 benchmarks and a
            fitted model on 8. Two model margins are material.{" "}
            <strong>ProofBench</strong>, linear regression, test MAE{" "}
            <strong>0.1328</strong>, margin <strong>0.111</strong>.{" "}
            <strong>Aider polyglot</strong>, gradient boosting, test MAE{" "}
            <strong>10.09</strong> percent, margin <strong>6.59</strong>. Six
            other adopted wins have margins under 0.01 and are tiny, not
            findings. Terminal-Bench’s small win reverses on labs seen in
            training. A baseline won ARC-AGI, GPQA diamond, MATH level 5, MMLU,
            OTIS Mock AIME 2024-2025, DeepSWE, METR time horizon, and SciCode.
            Those rows are not machine-learning wins.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

function ReleaseTrack() {
  const [horizon, setHorizon] = useState<HorizonId>("3")

  return (
    <section id="releases" className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-2xl font-medium tracking-tight">
          Part A. Notable releases
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A row counts as notable when Epoch’s notability-criteria cell is not
          empty. That is Epoch’s flag, not a hand reading of flagship
          generations. Google matches Google, Google DeepMind, or DeepMind.
          Mistral is excluded. No model in this window matches two of the seven
          labs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lab mix of the 215 notable releases</CardTitle>
            <CardDescription>
              January 2023 through the file’s latest publication date,{" "}
              {study.latestPublication}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CategoryChart
              data={notableLabs.map((lab) => ({
                label: lab.lab,
                count: lab.count,
                hover_count: `${lab.count} of ${study.notableModels}`,
              }))}
              series={[{ key: "count" }]}
              config={labConfig}
              yWidth={88}
            />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
              {notableLabs.map((lab) => (
                <li key={lab.lab} className="flex items-baseline justify-between gap-2">
                  <span>{lab.lab}</span>
                  <span className="font-mono tabular-nums">{lab.count}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              OpenAI 57, Google 53, Meta 32, Alibaba 32, Anthropic 22, DeepSeek
              10, xAI 9. The sum is 215.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Positive rate by horizon</CardTitle>
            <CardDescription>
              Full grid. A longer window is easier for a lab that publishes at
              all.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CategoryChart
              data={horizons.map((item) => ({
                label: item.label,
                rate: Number(item.rate.replace("%", "")),
                hover_rate: `${item.positiveLabel} (${item.rate})`,
              }))}
              series={[{ key: "rate" }]}
              config={rateConfig}
              horizontal={false}
              className="aspect-auto h-64 w-full"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horizon</TableHead>
                  <TableHead>Full grid</TableHead>
                  <TableHead>Positives</TableHead>
                  <TableHead>Scored rows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horizons.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {item.fullRows}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {item.positiveLabel} ({item.rate})
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {item.scoredRows}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Always-yes against per-lab frequency</CardTitle>
          <CardDescription>
            Accuracy is the share of scored rows whose hard call matches. Lower
            Brier is better. The switcher changes the charts and the per-lab
            bars. The table keeps every horizon on the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horizon</TableHead>
                <TableHead>Always-yes accuracy</TableHead>
                <TableHead>Always-yes Brier</TableHead>
                <TableHead>Frequency accuracy</TableHead>
                <TableHead>Frequency Brier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horizons.map((item) => (
                <TableRow
                  key={item.id}
                  data-state={horizon === item.id ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => setHorizon(item.id)}
                >
                  <TableCell>{item.label}</TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.alwaysYes.label}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.alwaysYes.brier}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.frequency.label}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {item.frequency.brier}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Tabs
            value={horizon}
            onValueChange={(value) => {
              if (value === "3" || value === "6" || value === "12") {
                setHorizon(value)
              }
            }}
          >
            <TabsList>
              {horizons.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {horizons.map((item) => (
              <TabsContent key={item.id} value={item.id} className="flex flex-col gap-4">
                <p className="max-w-3xl text-sm leading-relaxed">{item.finding}</p>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">
                      Correct hard calls out of {item.scoredRows} scored rows
                    </h3>
                    <CategoryChart
                      data={[
                        {
                          label: "Always yes",
                          correct: item.alwaysYes.correct,
                          hover_correct: item.alwaysYes.label,
                        },
                        {
                          label: "Frequency",
                          correct: item.frequency.correct,
                          hover_correct: item.frequency.label,
                        },
                      ]}
                      series={[{ key: "correct" }]}
                      config={accuracyConfig}
                      horizontal={false}
                      className="aspect-auto h-56 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">
                      Brier score, lower is better
                    </h3>
                    <CategoryChart
                      data={[
                        {
                          label: "Always yes",
                          brier: item.alwaysYes.brierValue,
                          hover_brier: item.alwaysYes.brier,
                        },
                        {
                          label: "Frequency",
                          brier: item.frequency.brierValue,
                          hover_brier: item.frequency.brier,
                        },
                      ]}
                      series={[{ key: "brier" }]}
                      config={brierConfig}
                      horizontal={false}
                      className="aspect-auto h-56 w-full"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.cadence}</p>
                <Separator />
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">
                    Per-lab positive labels, {item.label}, full grid of{" "}
                    {item.cutoffs} cutoffs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These bars are every valid cutoff, including months the
                    baselines are not yet allowed to score. The accuracy table
                    uses only the scored rows.
                  </p>
                  <CategoryChart
                    data={item.labs.map((lab) => ({
                      label: lab.lab,
                      positive: lab.positive,
                      negative: lab.negative,
                      hover_positive: lab.label,
                      hover_negative: `${lab.negative} negative of ${item.cutoffs}`,
                    }))}
                    series={[
                      { key: "positive", stackId: "windows" },
                      { key: "negative", stackId: "windows" },
                    ]}
                    config={labRateConfig}
                    yWidth={92}
                  />
                  <ul className="grid gap-1 text-sm sm:grid-cols-2">
                    {item.labs.map((lab) => (
                      <li
                        key={lab.lab}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span>{lab.lab}</span>
                        <span className="font-mono tabular-nums">{lab.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}

function ScoreTrack() {
  const [filter, setFilter] = useState<FilterValue>("all")
  const [query, setQuery] = useState("")
  const [selectedName, setSelectedName] = useState("ProofBench")

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return benchmarks.filter((benchmark) => {
      const family =
        filter === "all" ||
        (filter === "model"
          ? benchmark.reading !== "baseline"
          : benchmark.reading === filter)
      const named =
        needle.length === 0 || benchmark.name.toLowerCase().includes(needle)
      return family && named
    })
  }, [filter, query])

  const selected =
    visible.find((benchmark) => benchmark.name === selectedName) ?? visible[0]

  const proof = benchmarks.find((benchmark) => benchmark.name === "ProofBench")
  const aider = benchmarks.find((benchmark) => benchmark.name === "Aider polyglot")

  return (
    <section id="scores" className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-2xl font-medium tracking-tight">
          Part B. A later score from earlier rows
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The winner is the official method with the lowest test MAE. A model
          is adopted only when its test MAE is strictly below both baselines:
          the last observed score, and a historical linear trend. MAE stays in
          the benchmark’s own unit. A proportion error is not compared with a
          percent error or with minutes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {proof ? (
          <Card>
            <CardHeader>
              <CardTitle>Material win · ProofBench</CardTitle>
              <CardDescription>
                Reasoning · proportion · {proof.nTest} test rows ·{" "}
                {proof.testWindow}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
              <p>
                Linear regression. Test MAE <strong>0.1328</strong>. Margin{" "}
                <strong>0.111</strong> over the stronger baseline. The results
                table prints that margin as 0.1111. RMSE {proof.reportRmse}. R²{" "}
                {proof.reportR2}.
              </p>
              <Button
                variant="outline"
                className="w-fit"
                onClick={() => {
                  setFilter("material")
                  setQuery("")
                  setSelectedName("ProofBench")
                }}
              >
                Show ProofBench in the table
              </Button>
            </CardContent>
          </Card>
        ) : null}
        {aider ? (
          <Card>
            <CardHeader>
              <CardTitle>Material win · Aider polyglot</CardTitle>
              <CardDescription>
                Coding · percent · {aider.nTest} test rows · {aider.testWindow}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
              <p>
                Gradient boosting. Test MAE <strong>10.09</strong> percent.
                Margin <strong>6.59</strong> percentage points. The results
                table prints that margin as 6.594. RMSE {aider.reportRmse}. R²{" "}
                {aider.reportR2}. On labs seen in training the model stays
                ahead (MAE 9.831 against 18.24 on 9 rows).
              </p>
              <Button
                variant="outline"
                className="w-fit"
                onClick={() => {
                  setFilter("material")
                  setQuery("")
                  setSelectedName("Aider polyglot")
                }}
              >
                Show Aider polyglot in the table
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Alert>
        <AlertTitle>Where a baseline won, the model is not the result</AlertTitle>
        <AlertDescription>
          <p>
            Baseline wins:{" "}
            {benchmarks
              .filter((benchmark) => benchmark.reading === "baseline")
              .map((benchmark) => benchmark.name)
              .join(", ")}
            . Tiny adopted margins, under 0.01 and not findings:{" "}
            {benchmarks
              .filter((benchmark) => benchmark.reading === "tiny")
              .map((benchmark) => benchmark.name)
              .join(", ")}
            . Terminal-Bench is in that tiny set, and its advantage reverses
            once unseen labs are set aside. Multimodality has{" "}
            {study.multimodalityBenchmarks} benchmarks and{" "}
            {study.multimodalityRows} rows. Every series fails the sample rule,
            so that capability is descriptive only.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Benchmark holdout</CardTitle>
          <CardDescription>
            Filter by who won, or search a name. Select a row to plot test MAE
            for that benchmark alone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="md:flex-row md:items-end">
            <Field>
              <FieldLabel htmlFor="winner-filter">Winner</FieldLabel>
              <Select
                items={filterItems}
                value={filter}
                onValueChange={(value) => {
                  if (
                    value === "all" ||
                    value === "baseline" ||
                    value === "model" ||
                    value === "material" ||
                    value === "tiny"
                  ) {
                    setFilter(value)
                  }
                }}
              >
                <SelectTrigger id="winner-filter" className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filterItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="benchmark-search">Benchmark</FieldLabel>
              <Input
                id="benchmark-search"
                value={query}
                placeholder="Search the 16 names"
                onChange={(event) => setQuery(event.target.value)}
              />
            </Field>
            <Button
              variant="outline"
              onClick={() => {
                setFilter("all")
                setQuery("")
                setSelectedName("ProofBench")
              }}
            >
              Clear filters
            </Button>
          </FieldGroup>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {visible.length} of {benchmarks.length} modeled benchmarks.
          </p>

          {visible.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>No benchmark matches</EmptyTitle>
                <EmptyDescription>
                  {query.trim()
                    ? `Nothing in this winner group matches “${query.trim()}”.`
                    : "This winner group is empty."}{" "}
                  Clear the filter to return to all 16 modeled benchmarks.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                onClick={() => {
                  setFilter("all")
                  setQuery("")
                }}
              >
                Show all 16
              </Button>
            </Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <BenchmarkTable
                  rows={visible}
                  selectedName={selected?.name}
                  onSelect={setSelectedName}
                />
              </div>
              <div className="flex flex-col gap-3 md:hidden">
                {visible.map((benchmark) => (
                  <Card
                    key={benchmark.name}
                    size="sm"
                    data-state={
                      selected?.name === benchmark.name ? "selected" : undefined
                    }
                    className={cn(
                      selected?.name === benchmark.name && "bg-muted"
                    )}
                  >
                    <CardHeader>
                      <CardTitle>{benchmark.name}</CardTitle>
                      <CardDescription>
                        {benchmark.capability} · {benchmark.unitLabel} ·{" "}
                        {benchmark.nTest} test rows
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={readingVariant(benchmark.reading)}>
                          {readingLabel[benchmark.reading]}
                        </Badge>
                        <span className="text-sm">
                          {methodLabels[benchmark.winner]}
                        </span>
                      </div>
                      <p className="font-mono text-sm tabular-nums">
                        MAE {benchmark.reportMae} · margin {benchmark.reportMargin}{" "}
                        · RMSE {benchmark.reportRmse} · R² {benchmark.reportR2}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => setSelectedName(benchmark.name)}
                      >
                        Plot test MAE
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {selected ? <MaePanel benchmark={selected} /> : null}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function BenchmarkTable({
  rows,
  selectedName,
  onSelect,
}: {
  rows: BenchmarkResult[]
  selectedName?: string
  onSelect: (name: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Benchmark</TableHead>
          <TableHead>Capability</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Test rows</TableHead>
          <TableHead>Winner</TableHead>
          <TableHead>Test MAE</TableHead>
          <TableHead>Margin</TableHead>
          <TableHead>RMSE</TableHead>
          <TableHead>R²</TableHead>
          <TableHead>Reading</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((benchmark) => (
          <TableRow
            key={benchmark.name}
            data-state={selectedName === benchmark.name ? "selected" : undefined}
            className="cursor-pointer"
            tabIndex={0}
            onClick={() => onSelect(benchmark.name)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(benchmark.name)
              }
            }}
          >
            <TableCell className="whitespace-normal font-medium">
              {benchmark.name}
            </TableCell>
            <TableCell>{benchmark.capability}</TableCell>
            <TableCell>{benchmark.unitLabel}</TableCell>
            <TableCell className="font-mono tabular-nums">
              {benchmark.nTest}
            </TableCell>
            <TableCell className="whitespace-normal">
              {methodLabels[benchmark.winner]}
            </TableCell>
            <TableCell className="font-mono tabular-nums">
              {benchmark.reportMae}
            </TableCell>
            <TableCell className="font-mono tabular-nums">
              {benchmark.reportMargin}
            </TableCell>
            <TableCell className="font-mono tabular-nums">
              {benchmark.reportRmse}
            </TableCell>
            <TableCell className="font-mono tabular-nums">
              {benchmark.reportR2}
            </TableCell>
            <TableCell>
              <Badge variant={readingVariant(benchmark.reading)}>
                {readingLabel[benchmark.reading]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function MaePanel({ benchmark }: { benchmark: BenchmarkResult }) {
  const rows = methodOrder.map((method) => ({
    label: methodLabels[method],
    mae: benchmark.mae[method],
    hover: `${formatMae(benchmark.mae[method], benchmark.unit)} ${benchmark.unitLabel}`,
    winner: method === benchmark.winner,
  }))

  return (
    <div id="mae-chart" className="flex flex-col gap-3">
      <Separator />
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-medium">
          Test MAE · {benchmark.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {benchmark.nTrain} training rows, {benchmark.nTest} test rows,{" "}
          {benchmark.testWindow}. The ochre bar is the official winner. Hover a
          bar for the value. Lengths are {benchmark.unitLabel} on this
          benchmark only.
        </p>
      </div>
      <MaeChart data={rows} unitLabel={benchmark.unitLabel} />
      <ul className="grid gap-1 text-sm">
        {rows.map((row) => (
          <li key={row.label} className="flex items-baseline justify-between gap-3">
            <span>
              {row.label}
              {row.winner ? " · winner" : ""}
            </span>
            <span className="font-mono tabular-nums">{row.hover}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        Winner test MAE {benchmark.reportMae}. Margin {benchmark.reportMargin}.
        RMSE {benchmark.reportRmse}. R² {benchmark.reportR2}.
      </p>
      <Alert>
        <AlertTitle>{readingLabel[benchmark.reading]}</AlertTitle>
        <AlertDescription>
          <p>{benchmark.caveat}</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function MethodNote() {
  return (
    <section id="method" className="flex flex-col gap-4">
      <h2 className="font-heading text-2xl font-medium tracking-tight">
        How the numbers were made
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Releases, in time order</CardTitle>
            <CardDescription>
              Epoch all-models CSV, {study.epochRows.toLocaleString()} data
              rows
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              Cutoffs are the first of each month from January 2023. The label
              is positive when the lab has at least one notable publication
              strictly after the cutoff and on or before the horizon end. A
              cutoff is kept only when that end is on or before{" "}
              {study.latestPublication}. There is no partial closing month.
            </p>
            <p>
              A baseline at a cutoff may use publications dated on or before
              that cutoff, and an earlier label only when that horizon has
              already closed. Scoring waits for six earlier cutoffs and one
              closed horizon. Monthly windows overlap, so the averages are not
              independent-trial standard errors.
            </p>
            <p>
              Always-yes predicts 1 on every scored row. Frequency uses that
              lab’s positive rate on its own closed earlier cutoffs, and calls
              yes at 0.5. No classifier was trained. A token filter that drops
              mini, nano, ocr, embedding, and distill removes 11 of the 215
              rows and changes no label.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scores, without leakage</CardTitle>
            <CardDescription>
              Public Epoch benchmark scores, chronological split
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              Features for a row come from strictly earlier dates on the same
              benchmark. Same-day rows do not see each other. The target score
              is not a feature. A row is eligible with at least three earlier
              rows, two earlier dates, and one earlier row from the same lab.
            </p>
            <p>
              Eligible rows stay in date order. The last training date is the
              date at 80 percent of the eligible count, rounded down, and every
              row on that date stays in training. The split is not shuffled. A
              benchmark is modeled only with at least 24 training rows and 8
              test rows. Sixteen meet that bar. Fourteen, including every
              multimodality series, stay descriptive.
            </p>
            <p>
              Linear regression, random forest (300 trees, depth 4, leaf size
              3), and gradient boosting (200 trees, depth 2, learning rate
              0.05, leaf size 3, seed 0) are fit once on the training prefix.
              Hyperparameters were fixed before the test metrics were read. The
              two baselines are rebuilt from strictly earlier rows, including
              earlier test rows, so they see a fresher level than the fitted
              models.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
