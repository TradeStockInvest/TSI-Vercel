"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search, Brain, RefreshCw, BookOpen, Lightbulb } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface NewsItem {
  id?: string
  title: string
  description?: string
  summary?: string
  url: string
  source: {
    name: string
  }
  publishedAt: string
  urlToImage?: string
  sentiment?: "positive" | "negative" | "neutral"
  impact?: "high" | "medium" | "low"
  aiAnalysis?: string
}

interface DeepLearningInsight {
  id: string
  date: string
  topic: string
  insight: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  relatedSymbols: string[]
  source: string[]
}

export function NewsContent() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")
  const [isLearning, setIsLearning] = useState(false)
  const [learningProgress, setLearningProgress] = useState(0)
  const [deepLearningInsights, setDeepLearningInsights] = useState<DeepLearningInsight[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const learningIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved insights from localStorage
  useEffect(() => {
    const savedInsights = localStorage.getItem("deepLearningInsights")
    if (savedInsights) {
      try {
        setDeepLearningInsights(JSON.parse(savedInsights))
      } catch (e) {
        console.error("Error parsing saved insights:", e)
      }
    }

    const lastUpdatedStr = localStorage.getItem("newsLastUpdated")
    if (lastUpdatedStr) {
      setLastUpdated(new Date(lastUpdatedStr))
    }

    return () => {
      if (learningIntervalRef.current) {
        clearInterval(learningIntervalRef.current)
      }
    }
  }, [])

  // Save insights to localStorage when they change
  useEffect(() => {
    if (deepLearningInsights.length > 0) {
      localStorage.setItem("deepLearningInsights", JSON.stringify(deepLearningInsights))
    }
  }, [deepLearningInsights])

  // Fetch news from free API
  const fetchNews = async (category = "general") => {
    setLoading(true)
    setError(null)

    try {
      // Using Gnews API (free tier)
      const apiKey = "9d5b0a9a1d5a3b5a7d8a0d5a3b5a7d8a" // Replace with your actual API key
      const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${apiKey}`

      // For demo purposes, we'll use a mock response
      // const response = await axios.get(url)
      // const newsData = response.data.articles

      // Mock news data
      const newsData = generateMockNews(category)

      // Process the news data
      const processedNews = newsData.map((article: any, index: number) => ({
        id: `news-${index}`,
        title: article.title,
        description: article.description,
        summary: article.description,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        urlToImage: article.image,
      }))

      setNews(processedNews)
      setLastUpdated(new Date())
      localStorage.setItem("newsLastUpdated", new Date().toISOString())

      // Start AI analysis of news
      if (processedNews.length > 0) {
        analyzeNewsWithAI(processedNews)
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Failed to load news. Using demo data instead.")

      // Use mock data as fallback
      const mockNews = generateMockNews(category)
      setNews(mockNews)

      // Still try to analyze the mock news
      if (mockNews.length > 0) {
        analyzeNewsWithAI(mockNews)
      }
    } finally {
      setLoading(false)
    }
  }

  // Generate mock news data for demo purposes
  const generateMockNews = (category: string) => {
    const currentDate = new Date().toISOString()

    const mockNewsByCategory = {
      general: [
        {
          title: "Global Markets Rally on Economic Recovery Signs",
          description:
            "Stock markets around the world showed strong gains as new economic data suggests a faster than expected recovery from recent downturns.",
          url: "https://example.com/markets-rally",
          source: { name: "Financial Times" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Tech Giants Face New Regulatory Challenges",
          description:
            "Major technology companies are preparing for increased scrutiny as lawmakers propose new regulations on data privacy and market competition.",
          url: "https://example.com/tech-regulation",
          source: { name: "Tech Insider" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Federal Reserve Signals Potential Interest Rate Changes",
          description:
            "The Federal Reserve has indicated it may adjust interest rates in response to changing economic conditions and inflation concerns.",
          url: "https://example.com/fed-rates",
          source: { name: "Wall Street Journal" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Oil Prices Surge Amid Supply Chain Disruptions",
          description:
            "Global oil prices have increased sharply following reports of production challenges and transportation bottlenecks in key regions.",
          url: "https://example.com/oil-prices",
          source: { name: "Energy Report" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Retail Sales Exceed Expectations in Q2",
          description:
            "Consumer spending has shown remarkable resilience with retail sales figures surpassing analyst predictions for the second quarter.",
          url: "https://example.com/retail-sales",
          source: { name: "Business Daily" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      business: [
        {
          title: "Major Merger Announced Between Industry Leaders",
          description:
            "Two of the largest companies in the manufacturing sector have announced plans to merge, creating a new market giant.",
          url: "https://example.com/merger-news",
          source: { name: "Business Insider" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Startup Secures Record-Breaking Funding Round",
          description:
            "A promising fintech startup has secured $500 million in Series C funding, marking one of the largest investment rounds this year.",
          url: "https://example.com/startup-funding",
          source: { name: "Venture Beat" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "E-commerce Growth Continues to Accelerate",
          description:
            "Online retail sales have maintained strong momentum, with year-over-year growth exceeding 25% across major markets.",
          url: "https://example.com/ecommerce-growth",
          source: { name: "Retail Dive" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      technology: [
        {
          title: "Revolutionary AI Model Breaks Performance Records",
          description:
            "Researchers have unveiled a new artificial intelligence system that significantly outperforms existing models in complex reasoning tasks.",
          url: "https://example.com/ai-breakthrough",
          source: { name: "Tech Review" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Semiconductor Shortage Expected to Ease by Year End",
          description:
            "Industry analysts predict the global chip shortage will begin to resolve in the coming months as production capacity increases.",
          url: "https://example.com/chip-shortage",
          source: { name: "Hardware Weekly" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Quantum Computing Milestone Achieved",
          description:
            "Scientists report a significant breakthrough in quantum computing technology, potentially accelerating practical applications.",
          url: "https://example.com/quantum-milestone",
          source: { name: "Science Today" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      finance: [
        {
          title: "Cryptocurrency Market Sees Significant Volatility",
          description:
            "Major cryptocurrencies experienced price swings of over 15% as regulatory news and institutional adoption continue to influence the market.",
          url: "https://example.com/crypto-volatility",
          source: { name: "Crypto News" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "Banking Sector Reports Strong Quarterly Earnings",
          description:
            "Major financial institutions have posted better-than-expected profits, indicating robust performance despite economic uncertainties.",
          url: "https://example.com/bank-earnings",
          source: { name: "Financial Post" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          title: "New ETFs Focus on Sustainable Investments",
          description:
            "Several new exchange-traded funds specializing in environmental and social governance criteria have launched to meet growing investor demand.",
          url: "https://example.com/esg-etfs",
          source: { name: "Investment Weekly" },
          publishedAt: currentDate,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    }

    return mockNewsByCategory[category as keyof typeof mockNewsByCategory] || mockNewsByCategory.general
  }

  // Analyze news with AI
  const analyzeNewsWithAI = async (newsItems: NewsItem[]) => {
    setIsLearning(true)
    setLearningProgress(0)

    // Create a learning interval that simulates AI processing
    learningIntervalRef.current = setInterval(() => {
      setLearningProgress((prev) => {
        const newProgress = prev + Math.random() * 5
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 500)

    try {
      // Process each news item sequentially
      for (let i = 0; i < newsItems.length; i++) {
        const item = newsItems[i]

        // Skip if we already have an analysis for this item
        if (item.sentiment && item.aiAnalysis) continue

        try {
          // In a real implementation, we would call the OpenAI API
          // For demo purposes, we'll simulate the analysis
          const sentiment = await simulateAIAnalysis(item.title, "sentiment")
          const impact = await simulateAIAnalysis(item.title, "impact")
          const analysis = await simulateAIAnalysis(item.title, "analysis")

          // Update the news item with AI analysis
          newsItems[i] = {
            ...item,
            sentiment: sentiment as "positive" | "negative" | "neutral",
            impact: impact as "high" | "medium" | "low",
            aiAnalysis: analysis,
          }

          // Update progress
          setLearningProgress(((i + 1) / newsItems.length) * 100)
        } catch (err) {
          console.error(`Error analyzing news item: ${item.title}`, err)
        }
      }

      // Update the news state with analyzed items
      setNews([...newsItems])

      // Generate deep learning insights based on the analyzed news
      generateDeepLearningInsights(newsItems)
    } catch (err) {
      console.error("Error in AI analysis process:", err)
    } finally {
      if (learningIntervalRef.current) {
        clearInterval(learningIntervalRef.current)
      }
      setIsLearning(false)
      setLearningProgress(100)
    }
  }

  // Simulate AI analysis for demo purposes
  const simulateAIAnalysis = async (text: string, type: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

    if (type === "sentiment") {
      // Determine sentiment based on keywords
      const positiveWords = [
        "rally",
        "gain",
        "growth",
        "positive",
        "surge",
        "exceed",
        "strong",
        "breakthrough",
        "milestone",
      ]
      const negativeWords = [
        "challenge",
        "disruption",
        "shortage",
        "volatility",
        "uncertainty",
        "concern",
        "risk",
        "decline",
      ]

      const lowerText = text.toLowerCase()
      const hasPositive = positiveWords.some((word) => lowerText.includes(word))
      const hasNegative = negativeWords.some((word) => lowerText.includes(word))

      if (hasPositive && !hasNegative) return "positive"
      if (hasNegative && !hasPositive) return "negative"
      return "neutral"
    }

    if (type === "impact") {
      // Determine impact based on keywords
      const highImpactWords = ["significant", "major", "revolutionary", "record", "surge", "milestone"]
      const mediumImpactWords = ["change", "increase", "growth", "new", "potential"]

      const lowerText = text.toLowerCase()
      const hasHighImpact = highImpactWords.some((word) => lowerText.includes(word))
      const hasMediumImpact = mediumImpactWords.some((word) => lowerText.includes(word))

      if (hasHighImpact) return "high"
      if (hasMediumImpact) return "medium"
      return "low"
    }

    if (type === "analysis") {
      // Generate a simple analysis based on the title
      const analyses = [
        "This news could have significant implications for market sentiment in the short term.",
        "Investors should monitor developments in this area as they may impact related sectors.",
        "This development aligns with broader market trends we've been observing.",
        "The timing of this news is notable given current economic conditions.",
        "This could represent a potential inflection point for the affected market segments.",
        "The market reaction to this news will be worth watching closely.",
        "This development may have both immediate and longer-term implications for investors.",
        "This news reinforces existing market narratives around growth and innovation.",
        "The specifics of this announcement warrant careful analysis for potential trading opportunities.",
      ]

      return analyses[Math.floor(Math.random() * analyses.length)]
    }

    return ""
  }

  // Generate deep learning insights from analyzed news
  const generateDeepLearningInsights = (analyzedNews: NewsItem[]) => {
    // Group news by sentiment
    const positiveNews = analyzedNews.filter((item) => item.sentiment === "positive")
    const negativeNews = analyzedNews.filter((item) => item.sentiment === "negative")
    const neutralNews = analyzedNews.filter((item) => item.sentiment === "neutral")

    // Extract potential stock symbols from news titles
    const extractSymbols = (text: string): string[] => {
      const commonSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"]
      return commonSymbols.filter((symbol) => Math.random() > 0.7) // Randomly select symbols for demo
    }

    // Generate insights based on news sentiment patterns
    const newInsights: DeepLearningInsight[] = []

    if (positiveNews.length > negativeNews.length) {
      newInsights.push({
        id: `insight-${Date.now()}-1`,
        date: new Date().toISOString(),
        topic: "Market Sentiment",
        insight: "Positive news sentiment dominates today's headlines, suggesting potential upward market momentum.",
        sentiment: "positive",
        confidence: 70 + Math.floor(Math.random() * 20),
        relatedSymbols: extractSymbols(""),
        source: positiveNews.map((n) => n.title).slice(0, 2),
      })
    } else if (negativeNews.length > positiveNews.length) {
      newInsights.push({
        id: `insight-${Date.now()}-2`,
        date: new Date().toISOString(),
        topic: "Market Risks",
        insight: "Negative news sentiment is prevalent, indicating potential market headwinds in the near term.",
        sentiment: "negative",
        confidence: 65 + Math.floor(Math.random() * 20),
        relatedSymbols: extractSymbols(""),
        source: negativeNews.map((n) => n.title).slice(0, 2),
      })
    }

    // Add sector-specific insights
    const techNews = analyzedNews.filter(
      (item) =>
        item.title.toLowerCase().includes("tech") ||
        item.title.toLowerCase().includes("ai") ||
        item.title.toLowerCase().includes("semiconductor"),
    )

    if (techNews.length > 0) {
      const techSentiment =
        techNews.filter((n) => n.sentiment === "positive").length >
        techNews.filter((n) => n.sentiment === "negative").length
          ? "positive"
          : "negative"

      newInsights.push({
        id: `insight-${Date.now()}-3`,
        date: new Date().toISOString(),
        topic: "Technology Sector",
        insight:
          techSentiment === "positive"
            ? "Technology sector news shows positive bias, potentially favorable for tech stocks."
            : "Technology sector faces challenges based on recent news, suggesting caution for tech investments.",
        sentiment: techSentiment,
        confidence: 60 + Math.floor(Math.random() * 30),
        relatedSymbols: ["AAPL", "MSFT", "GOOGL", "META", "NVDA"].filter(() => Math.random() > 0.4),
        source: techNews.map((n) => n.title).slice(0, 2),
      })
    }

    // Add the new insights to the existing ones
    setDeepLearningInsights((prev) => {
      // Keep only the 20 most recent insights
      const combined = [...newInsights, ...prev]
      return combined.slice(0, 20)
    })
  }

  // Fetch news when component mounts or category changes
  useEffect(() => {
    fetchNews(activeCategory)
  }, [activeCategory])

  // Get sentiment badge for news items
  const getSentimentBadge = (sentiment?: NewsItem["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Positive
          </Badge>
        )
      case "negative":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
            Negative
          </Badge>
        )
      case "neutral":
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            Neutral
          </Badge>
        )
      default:
        return null
    }
  }

  // Get impact badge for news items
  const getImpactBadge = (impact?: NewsItem["impact"]) => {
    switch (impact) {
      case "high":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            High Impact
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Medium Impact
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Low Impact
          </Badge>
        )
      default:
        return null
    }
  }

  // Filter news based on search term
  const filteredNews = news.filter((item) => {
    if (!searchTerm) return true
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Market News</h1>
        <p className="text-muted-foreground">Latest financial news with AI-powered analysis and insights</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fetchNews(activeCategory)}
            disabled={isLearning}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          {isLearning && (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${learningProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(learningProgress)}%</span>
            </div>
          )}

          {lastUpdated && !isLearning && (
            <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="sticky top-16 z-10 -mx-6 bg-background px-6 py-4 border-b">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No news available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredNews.map((item) => (
                <Card key={item.id || item.url} className="flex flex-col overflow-hidden">
                  {item.urlToImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={item.urlToImage || "/placeholder.svg"}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      {item.source.name} • {new Date(item.publishedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.description || item.summary}</p>

                    {item.aiAnalysis && (
                      <div className="mt-3 p-2 bg-primary/5 rounded-md border border-primary/10">
                        <div className="flex items-center gap-1 text-xs font-medium mb-1">
                          <Brain className="h-3 w-3 text-primary" />
                          <span>AI Analysis:</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.aiAnalysis}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 mt-auto flex justify-between items-center">
                    <div className="flex gap-2">
                      {getSentimentBadge(item.sentiment)}
                      {getImpactBadge(item.impact)}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      Read more <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Deep Learning Insights
              </CardTitle>
              <CardDescription>Market insights generated from news analysis</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {deepLearningInsights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No insights available yet</p>
                  <p className="text-sm text-muted-foreground">AI is analyzing news to generate insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deepLearningInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-3 rounded-lg border ${
                        insight.sentiment === "positive"
                          ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                          : insight.sentiment === "negative"
                            ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30"
                            : "bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb
                          className={`h-4 w-4 ${
                            insight.sentiment === "positive"
                              ? "text-emerald-500"
                              : insight.sentiment === "negative"
                                ? "text-rose-500"
                                : "text-slate-500"
                          }`}
                        />
                        <span className="font-medium text-sm">{insight.topic}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(insight.date).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm mb-2">{insight.insight}</p>

                      {insight.relatedSymbols.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {insight.relatedSymbols.map((symbol) => (
                            <Badge key={symbol} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Confidence: {insight.confidence}%</span>
                        <span>Sources: {insight.source.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

