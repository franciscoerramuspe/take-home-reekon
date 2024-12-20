'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { AlertTriangle, Activity, TrendingUp, Zap, Clock, AlertCircle } from 'lucide-react'
import { ErrorAnalytics } from "@/types/robotErrors"

interface ErrorAnalyticsProps {
  data: ErrorAnalytics
}

const severityColors = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a'
}

const chartGradient = {
  id: 'errorGradient',
  x1: '0',
  y1: '0',
  x2: '0',
  y2: '1',
  stops: [
    { offset: '0%', color: '#3b82f6', opacity: 1 },
    { offset: '100%', color: '#1d4ed8', opacity: 0.8 },
  ],
}

export function ErrorAnalyticsView({ data }: ErrorAnalyticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Total Errors Card */}
      <Card className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-blue-100">Total Errors</CardTitle>
          <AlertTriangle className="h-4 w-4 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.totalErrors}</div>
          <p className="text-sm text-blue-200 mt-1">
            In the last 7 days
          </p>
        </CardContent>
      </Card>

      {/* Errors by Severity */}
      <Card className="md:col-span-2 lg:col-span-3 border-0 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-200">Errors by Severity</CardTitle>
          <CardDescription>Distribution of errors by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.errorsBySeverity).map(([severity, count]) => (
              <div key={severity} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: severityColors[severity as keyof typeof severityColors] }}
                    />
                    <span className="text-sm font-medium text-gray-200 capitalize">{severity}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-200">{count}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-in-out"
                    style={{ 
                      width: `${(count / data.totalErrors) * 100}%`,
                      backgroundColor: severityColors[severity as keyof typeof severityColors]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Average Resolution Time Card */}
      <Card className="md:col-span-2 lg:col-span-2 border-0 bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-200">Resolution Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-100">
            {data.averageResolutionTime || 'N/A'}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Average time to resolve
          </p>
        </CardContent>
      </Card>

      {/* Most Common Error Card */}
      <Card className="md:col-span-2 lg:col-span-2 border-0 bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-gray-200">Most Common</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-gray-100 capitalize">
            {Object.entries(data.errorsByType).reduce((a, b) => a[1] > b[1] ? a : b)[0].replace('_', ' ')}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Most frequent error type
          </p>
        </CardContent>
      </Card>

      {/* Crash Frequency Chart */}
      <Card className="col-span-full border-0 bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-gray-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Crash Frequency
              </CardTitle>
              <CardDescription>Daily error occurrence over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.crashFrequency} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient {...chartGradient}>
                  {chartGradient.stops.map((stop, index) => (
                    <stop
                      key={index}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#60a5fa' }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value} errors`, 'Errors']}
              />
              <Bar 
                dataKey="count"
                fill="url(#errorGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Types Distribution */}
      <Card className="col-span-full border-0 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-200 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            Error Types
          </CardTitle>
          <CardDescription>Distribution of errors by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(data.errorsByType).map(([type, count]) => (
              <div 
                key={type} 
                className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 capitalize">
                    {type.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

