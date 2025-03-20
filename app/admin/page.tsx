"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  LogOut,
} from "lucide-react"

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [aiMetrics, setAiMetrics] = useState({
    totalArticlesProcessed: 0,
    totalInsightsGenerated: 0,
    learningProgress: 0,
    lastTrainingDate: "",
    accuracyScore: 0,
    confidenceAverage: 0,
    dataSourcesCount: 0,
    symbolsCovered: 0,
    positiveInsights: 0,
    negativeInsights: 0,
    neutralInsights: 0,
    processingSpeed: 0,
    memoryUsage: 0,
    errorRate: 0,
    successfulPredictions: 0,
    failedPredictions: 0,
  })
  const [recentInsights, setRecentInsights] = useState<any[]>([])
  const [learningLogs, setLearningLogs] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  // Check if user is admin
  useEffect(() => {
    // In a real app, you would check for admin authentication here
    // For demo purposes, we'll use a simple localStorage check
    const adminAccess = localStorage.getItem("adminAccess")
    if (adminAccess === "granted") {
      setIsAdmin(true)
    }

    // Load AI metrics from localStorage
    loadAiMetrics()

    setIsLoading(false)
  }, [])

  // Load AI metrics from localStorage
  const loadAiMetrics = () => {
    // Get insights from localStorage
    const insights = JSON.parse(localStorage.getItem("deepLearningInsights") || "[]")

    // Calculate metrics
    const totalInsights = insights.length
    const positiveInsights = insights.filter((i: any) => i.sentiment === "positive").length
    const negativeInsights = insights.filter((i: any) => i.sentiment === "negative").length
    const neutralInsights = insights.filter((i: any) => i.sentiment === "neutral").length

    // Get unique symbols
    const allSymbols = insights.flatMap((i: any) => i.relatedSymbols || [])
    const uniqueSymbols = new Set(allSymbols).size

    // Calculate average confidence
    const avgConfidence =
      insights.length > 0
        ? insights.reduce((acc: number, curr: any) => acc + (curr.confidence || 0), 0) / insights.length
        : 0

    // Generate mock metrics for demo
    const metrics = {
      totalArticlesProcessed: Math.floor(Math.random() * 1000) + 500,
      totalInsightsGenerated: totalInsights,
      learningProgress: Math.min(100, Math.floor(Math.random() * 30) + 70), // 70-100%
      lastTrainingDate: new Date().toISOString(),
      accuracyScore: Math.floor(Math.random() * 20) + 75, // 75-95%
      confidenceAverage: avgConfidence || Math.floor(Math.random() * 20) + 70, // 70-90%
      dataSourcesCount: Math.floor(Math.random() * 5) + 3, // 3-8
      symbolsCovered: uniqueSymbols || Math.floor(Math.random() * 100) + 50, // 50-150
      positiveInsights,
      negativeInsights,
      neutralInsights,
      processingSpeed: Math.floor(Math.random() * 500) + 100, // 100-600ms
      memoryUsage: Math.floor(Math.random() * 500) + 200, // 200-700MB
      errorRate: Math.floor(Math.random() * 5) + 1, // 1-6%
      successfulPredictions: Math.floor(Math.random() * 50) + 100, // 100-150
      failedPredictions: Math.floor(Math.random() * 20) + 10, // 10-30
    }

    setAiMetrics(metrics)
    setRecentInsights(insights.slice(0, 5))

    // Generate mock learning logs
    const mockLogs = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        level: "info",
        message: "Completed sentiment analysis on 24 financial news articles",
        details: "Positive: 10, Negative: 8, Neutral: 6",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        level: "info",
        message: "Generated 3 new market insights based on recent news patterns",
        details: "Topics: Market Sentiment, Technology Sector, Commodities",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        level: "warning",
        message: "Low confidence score detected in cryptocurrency market analysis",
        details: "Confidence: 58%, below threshold of 65%",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        level: "error",
        message: "Failed to process news from Financial Times API",
        details: "Error: Rate limit exceeded, retry after 60 minutes",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        level: "info",
        message: "Model weights updated based on prediction accuracy feedback",
        details: "Accuracy improved from 82.3% to 84.1%",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        level: "info",
        message: "Successfully processed historical data for AAPL, MSFT, GOOGL",
        details: "5 years of daily price data integrated into learning model",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        level: "success",
        message: "High accuracy prediction validated for tech sector movement",
        details: "Predicted +2.3% movement, actual: +2.1%, accuracy: 91.3%",
      },
    ]

    setLearningLogs(mockLogs)
  }

  // Handle admin login
  const handleAdminLogin = () => {
    // In a real app, you would validate the password against a secure backend
    // For demo purposes, we'll use a simple password check
    if (password === "admin123") {
      localStorage.setItem("adminAccess", "granted")
      setIsAdmin(true)
    } else {
      alert("Invalid password")
    }
  }

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem("adminAccess")
    setIsAdmin(false)
  }

  // If not admin, show login screen
  if (!isAdmin && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Card className="w-[400px] bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Admin Access Required
            </CardTitle>
            <CardDescription>This area is restricted to authorized personnel only.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Admin Password
                </label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAdminLogin}>
              Login to Admin Panel
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold">TradeStockInvest AI Admin</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-400 hover:text-white"
            onClick={handleAdminLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">AI Learning Dashboard</h2>
          <p className="text-slate-400">
            Monitor the AI's learning progress, performance metrics, and generated insights.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">
              Recent Insights
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
              Performance
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600">
              Learning Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.learningProgress}%</div>
                  <Progress value={aiMetrics.learningProgress} className="h-2 mt-2" />
                  <p className="text-xs text-slate-400 mt-2">
                    Last trained: {new Date(aiMetrics.lastTrainingDate).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Accuracy Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.accuracyScore}%</div>
                  <Progress value={aiMetrics.accuracyScore} className="h-2 mt-2" />
                  <p className="text-xs text-slate-400 mt-2">
                    Based on {aiMetrics.successfulPredictions + aiMetrics.failedPredictions} predictions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Articles Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.totalArticlesProcessed.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+{Math.floor(Math.random() * 50) + 10} today</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Insights Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.totalInsightsGenerated.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+{Math.floor(Math.random() * 10) + 1} today</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>Key metrics about the AI's learning process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Data Sources</div>
                        <div className="text-lg font-bold">{aiMetrics.dataSourcesCount}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Symbols Covered</div>
                        <div className="text-lg font-bold">{aiMetrics.symbolsCovered}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Processing Speed</div>
                        <div className="text-lg font-bold">{aiMetrics.processingSpeed} ms</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Memory Usage</div>
                        <div className="text-lg font-bold">{aiMetrics.memoryUsage} MB</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-medium mb-3">Insight Sentiment Distribution</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Positive</span>
                            <span>{aiMetrics.positiveInsights}</span>
                          </div>
                          <Progress
                            value={
                              aiMetrics.totalInsightsGenerated > 0
                                ? (aiMetrics.positiveInsights / aiMetrics.totalInsightsGenerated) * 100
                                : 0
                            }
                            className="h-2 bg-slate-800"
                            indicatorClassName="bg-emerald-500"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Negative</span>
                            <span>{aiMetrics.negativeInsights}</span>
                          </div>
                          <Progress
                            value={
                              aiMetrics.totalInsightsGenerated > 0
                                ? (aiMetrics.negativeInsights / aiMetrics.totalInsightsGenerated) * 100
                                : 0
                            }
                            className="h-2 bg-slate-800"
                            indicatorClassName="bg-rose-500"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Neutral</span>
                            <span>{aiMetrics.neutralInsights}</span>
                          </div>
                          <Progress
                            value={
                              aiMetrics.totalInsightsGenerated > 0
                                ? (aiMetrics.neutralInsights / aiMetrics.totalInsightsGenerated) * 100
                                : 0
                            }
                            className="h-2 bg-slate-800"
                            indicatorClassName="bg-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>How well the AI is performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Successful Predictions</div>
                        <div className="text-lg font-bold text-emerald-500">{aiMetrics.successfulPredictions}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Failed Predictions</div>
                        <div className="text-lg font-bold text-rose-500">{aiMetrics.failedPredictions}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Average Confidence</div>
                        <div className="text-lg font-bold">{aiMetrics.confidenceAverage.toFixed(1)}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Error Rate</div>
                        <div className="text-lg font-bold">{aiMetrics.errorRate}%</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-medium mb-3">Prediction Accuracy by Sector</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Technology</span>
                            <span>{Math.floor(Math.random() * 10) + 85}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 10) + 85} className="h-2 bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Finance</span>
                            <span>{Math.floor(Math.random() * 10) + 80}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 10) + 80} className="h-2 bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Healthcare</span>
                            <span>{Math.floor(Math.random() * 15) + 75}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 15) + 75} className="h-2 bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Energy</span>
                            <span>{Math.floor(Math.random() * 20) + 70}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 20) + 70} className="h-2 bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>What This All Means (In Plain English)</CardTitle>
                <CardDescription>A simple explanation of the AI's learning status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-950/30 border border-blue-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Current Learning Status</h3>
                  <p className="text-slate-300">
                    The AI has analyzed {aiMetrics.totalArticlesProcessed.toLocaleString()} news articles and generated{" "}
                    {aiMetrics.totalInsightsGenerated} market insights. It's currently {aiMetrics.learningProgress}%
                    through its learning process, which means it's{" "}
                    {aiMetrics.learningProgress >= 80 ? "quite mature" : "still developing"} in its understanding of
                    market patterns.
                  </p>
                </div>

                <div className="p-4 bg-emerald-950/30 border border-emerald-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">What's Working Well</h3>
                  <p className="text-slate-300">
                    The AI is performing best in the Technology sector with {Math.floor(Math.random() * 10) + 85}%
                    accuracy. It's successfully identified {aiMetrics.positiveInsights} positive market trends and has
                    an overall accuracy of {aiMetrics.accuracyScore}% when making predictions.
                  </p>
                </div>

                <div className="p-4 bg-amber-950/30 border border-amber-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                  <p className="text-slate-300">
                    The AI still has an error rate of {aiMetrics.errorRate}% and has made {aiMetrics.failedPredictions}{" "}
                    incorrect predictions. It's less confident in the Energy sector with only{" "}
                    {Math.floor(Math.random() * 20) + 70}% accuracy. More training data in these areas would help
                    improve performance.
                  </p>
                </div>

                <div className="p-4 bg-purple-950/30 border border-purple-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                  <p className="text-slate-300">To improve the AI's learning, consider:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                    <li>Adding more data sources (currently using {aiMetrics.dataSourcesCount})</li>
                    <li>Expanding coverage to more market symbols (currently tracking {aiMetrics.symbolsCovered})</li>
                    <li>Improving processing speed (currently {aiMetrics.processingSpeed}ms per article)</li>
                    <li>Reducing memory usage (currently using {aiMetrics.memoryUsage}MB)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Recent AI-Generated Insights</CardTitle>
                <CardDescription>The latest market insights generated by the AI</CardDescription>
              </CardHeader>
              <CardContent>
                {recentInsights.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-400">No insights generated yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentInsights.map((insight, index) => (
                      <div
                        key={insight.id || index}
                        className={`p-4 rounded-lg border ${
                          insight.sentiment === "positive"
                            ? "bg-emerald-950/20 border-emerald-900/30"
                            : insight.sentiment === "negative"
                              ? "bg-rose-950/20 border-rose-900/30"
                              : "bg-slate-900 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{insight.topic}</h3>
                          <Badge
                            variant="outline"
                            className={
                              insight.sentiment === "positive"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : insight.sentiment === "negative"
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            }
                          >
                            {insight.sentiment}
                          </Badge>
                        </div>

                        <p className="text-slate-300 mb-3">{insight.insight}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {insight.relatedSymbols &&
                            insight.relatedSymbols.map((symbol: string) => (
                              <Badge key={symbol} variant="secondary" className="bg-slate-800">
                                {symbol}
                              </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Generated: {new Date(insight.date).toLocaleString()}</span>
                          <span>Confidence: {insight.confidence}%</span>
                        </div>

                        {insight.source && insight.source.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <h4 className="text-xs font-medium text-slate-400 mb-2">Source Articles:</h4>
                            <ul className="space-y-1">
                              {insight.source.map((source: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-500">
                                  • {source}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Insights
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Insight Generation Process</CardTitle>
                  <CardDescription>How the AI creates market insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">1. News Collection</h4>
                          <p className="text-xs text-slate-400">Gathering financial news from multiple sources</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600">
                          <Brain className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">2. Sentiment Analysis</h4>
                          <p className="text-xs text-slate-400">
                            Determining if news is positive, negative, or neutral
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">3. Pattern Recognition</h4>
                          <p className="text-xs text-slate-400">Identifying trends across multiple news sources</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-600">
                          <LineChart className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">4. Insight Generation</h4>
                          <p className="text-xs text-slate-400">Creating actionable market insights</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Insight Quality Metrics</CardTitle>
                  <CardDescription>Measuring the value of generated insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Relevance Score</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 15) + 80}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 15) + 80} className="h-2" />
                      <p className="text-xs text-slate-400">How relevant insights are to current market conditions</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Actionability</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 75}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 20) + 75} className="h-2" />
                      <p className="text-xs text-slate-400">How useful insights are for making trading decisions</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Uniqueness</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 25) + 70}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 25) + 70} className="h-2" />
                      <p className="text-xs text-slate-400">How original insights are compared to common knowledge</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Timeliness</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10) + 85}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 10) + 85} className="h-2" />
                      <p className="text-xs text-slate-400">How quickly insights are generated after news events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Prediction Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.accuracyScore}%</div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">
                      +{Math.floor(Math.random() * 5) + 1}% from last week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (aiMetrics.successfulPredictions /
                        (aiMetrics.successfulPredictions + aiMetrics.failedPredictions)) *
                        100,
                    )}
                    %
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">
                      +{Math.floor(Math.random() * 3) + 1}% from last week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Average Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.confidenceAverage.toFixed(1)}%</div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">
                      +{Math.floor(Math.random() * 4) + 2}% from last week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.errorRate}%</div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500">
                      -{Math.floor(Math.random() * 2) + 1}% from last week
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Performance by Market Sector</CardTitle>
                  <CardDescription>How well the AI performs across different sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          Technology
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10) + 85}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 10) + 85}
                        className="h-2"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          Finance
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10) + 80}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 10) + 80}
                        className="h-2"
                        indicatorClassName="bg-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                          Healthcare
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 15) + 75}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 15) + 75}
                        className="h-2"
                        indicatorClassName="bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          Consumer Goods
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 15) + 75}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 15) + 75}
                        className="h-2"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          Energy
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 70}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 20) + 70}
                        className="h-2"
                        indicatorClassName="bg-red-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Performance by Time Horizon</CardTitle>
                  <CardDescription>Prediction accuracy across different timeframes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          Intraday (Hours)
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 15) + 75}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 15) + 75}
                        className="h-2"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          Short-term (Days)
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10) + 80}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 10) + 80}
                        className="h-2"
                        indicatorClassName="bg-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                          Medium-term (Weeks)
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10) + 85}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 10) + 85}
                        className="h-2"
                        indicatorClassName="bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          Long-term (Months)
                        </span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 15) + 75}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 15) + 75}
                        className="h-2"
                        indicatorClassName="bg-amber-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-medium mb-3">Key Observations</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>
                          Medium-term predictions (weeks) show highest accuracy at {Math.floor(Math.random() * 10) + 85}
                          %
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>
                          Short-term predictions have improved by {Math.floor(Math.random() * 5) + 5}% in the last month
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Long-term predictions need more historical data to improve accuracy</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Performance Improvement Recommendations</CardTitle>
                <CardDescription>Suggestions to enhance AI learning and prediction accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-950/30 border border-blue-900/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-400" />
                      Expand Data Sources
                    </h3>
                    <p className="text-slate-300 mb-3">
                      Adding more specialized financial news sources would improve sector-specific predictions.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current sources: {aiMetrics.dataSourcesCount}</span>
                      <span className="text-blue-400">Recommended: {aiMetrics.dataSourcesCount + 3}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-950/30 border border-purple-900/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-purple-400" />
                      Enhance Pattern Recognition
                    </h3>
                    <p className="text-slate-300 mb-3">
                      Improving the AI's ability to identify correlations between news events and market movements.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current accuracy: {aiMetrics.accuracyScore}%</span>
                      <span className="text-purple-400">Target: {Math.min(99, aiMetrics.accuracyScore + 5)}%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-950/30 border border-emerald-900/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-emerald-400" />
                      Sector-Specific Training
                    </h3>
                    <p className="text-slate-300 mb-3">
                      Focus on improving predictions in the Energy sector, which currently has the lowest accuracy.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Current Energy sector accuracy: {Math.floor(Math.random() * 20) + 70}%
                      </span>
                      <span className="text-emerald-400">Target: {Math.floor(Math.random() * 20) + 80}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>AI Learning Logs</CardTitle>
                <CardDescription>Detailed record of the AI's learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        log.level === "error"
                          ? "bg-rose-950/20 border-rose-900/30"
                          : log.level === "warning"
                            ? "bg-amber-950/20 border-amber-900/30"
                            : log.level === "success"
                              ? "bg-emerald-950/20 border-emerald-900/30"
                              : "bg-slate-950 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {log.level === "error" && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                          {log.level === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          {log.level === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          {log.level === "info" && <Brain className="h-4 w-4 text-blue-500" />}
                          <span className="font-medium">{log.message}</span>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>

                      {log.details && <p className="text-sm text-slate-400 ml-6">{log.details}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Export Logs
                </Button>
                <Button variant="outline" size="sm">
                  View All Logs
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Technical Performance</CardTitle>
                <CardDescription>System metrics for the AI learning process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">Processing Speed</div>
                      <div className="text-lg font-bold">{aiMetrics.processingSpeed} ms/article</div>
                      <div className="flex items-center gap-1">
                        <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-500">
                          -{Math.floor(Math.random() * 50) + 10} ms from last week
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">Memory Usage</div>
                      <div className="text-lg font-bold">{aiMetrics.memoryUsage} MB</div>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3 text-rose-500" />
                        <span className="text-xs text-rose-500">
                          +{Math.floor(Math.random() * 30) + 10} MB from last week
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">API Calls</div>
                      <div className="text-lg font-bold">{Math.floor(Math.random() * 1000) + 500}/day</div>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-amber-500">
                          +{Math.floor(Math.random() * 50) + 20} from last week
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">Storage Used</div>
                      <div className="text-lg font-bold">{Math.floor(Math.random() * 10) + 2} GB</div>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-amber-500">
                          +{Math.floor(Math.random() * 500) + 100} MB from last week
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-medium mb-3">System Health</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>CPU Usage</span>
                          <span>{Math.floor(Math.random() * 30) + 20}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 30) + 20} className="h-2 bg-slate-800" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Memory Allocation</span>
                          <span>{Math.floor(Math.random() * 40) + 30}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 40) + 30} className="h-2 bg-slate-800" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Disk I/O</span>
                          <span>{Math.floor(Math.random() * 20) + 10}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 20) + 10} className="h-2 bg-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

