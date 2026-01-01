'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface OverviewProps {
  data: Array<{
    month: string
    earnings: number
  }>
}

interface ChartData {
  name: string
  total: number
  percentage: number
}

export function Overview({ data }: OverviewProps) {
  // Calculate percentages relative to 500 (fixed maximum)
  const chartData = data.map(item => ({
    name: item.month,
    total: item.earnings,
    // If earnings are 0, show 0%, otherwise calculate percentage of 500
    percentage: item.earnings === 0 ? 0 : (item.earnings / 500) * 100
  }))

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        No earnings data available
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload || !payload[0]) return null

    const data = payload[0].payload as ChartData
    return (
      <div className="rounded-lg border bg-white p-2 shadow-md">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-gray-600">
              {data.name}
            </span>
            <span className="font-bold text-gray-900">
              ${data.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]} // Set the domain from 0 to 100%
        />
        <Tooltip content={CustomTooltip} />
        <Bar
          dataKey="percentage"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
