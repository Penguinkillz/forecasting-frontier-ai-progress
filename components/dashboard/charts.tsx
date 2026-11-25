"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Row = Record<string, string | number | boolean>

export function CategoryChart({
  data,
  series,
  config,
  horizontal = true,
  yWidth = 108,
  className = "aspect-auto h-72 w-full",
}: {
  data: Row[]
  series: { key: string; stackId?: string }[]
  config: ChartConfig
  horizontal?: boolean
  yWidth?: number
  className?: string
}) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
      >
        <CartesianGrid
          horizontal={!horizontal}
          vertical={horizontal}
          strokeDasharray="3 3"
        />
        {horizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              width={yWidth}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
            />
            <YAxis type="number" tickLine={false} axisLine={false} width={56} />
          </>
        )}
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => {
                const payload = item.payload as Row | undefined
                const key = String(item.dataKey ?? name)
                const hover = payload?.[`hover_${key}`]
                const shown =
                  typeof hover === "string" || typeof hover === "number"
                    ? String(hover)
                    : typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)
                return (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {shown}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={config[item.key]?.label as string}
            stackId={item.stackId}
            fill={`var(--color-${item.key})`}
            maxBarSize={22}
            radius={item.stackId ? 0 : 3}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}

export function MaeChart({
  data,
  unitLabel,
}: {
  data: { label: string; mae: number; hover: string; winner: boolean }[]
  unitLabel: string
}) {
  const config = {
    mae: {
      label: `Test MAE (${unitLabel})`,
      color: "var(--chart-1)",
    },
    winner: {
      label: "Lowest test MAE",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 4, right: 16, top: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={148}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => {
                const payload = item.payload as { hover?: string } | undefined
                return (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">Test MAE</span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {payload?.hover ?? String(value)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <Bar dataKey="mae" name="Test MAE" maxBarSize={22} radius={3}>
          {data.map((row) => (
            <Cell
              key={row.label}
              fill={row.winner ? "var(--chart-2)" : "var(--chart-1)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
