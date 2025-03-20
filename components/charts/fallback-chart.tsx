"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FallbackChartProps {
  symbol?: string
  data?: any[]
  height?: number
  width?: number
}

// Sample data in case no data is provided
const sampleData = [
  { date: "2023-01", price: 150 },
  { date: "2023-02", price: 155 },
  { date: "2023-03", price: 160 },
  { date: "2023-04", price: 165 },
  { date: "2023-05", price: 170 },
  { date: "2023-06", price: 175 },
  { date: "2023-07", price: 180 },
  { date: "2023-08", price: 185 },
  { date: "2023-09", price: 190 },
  { date: "2023-10", price: 195 },
]

export function FallbackChart({ symbol = "AAPL", data = sampleData, height = 400, width = 800 }: FallbackChartProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{symbol} Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

