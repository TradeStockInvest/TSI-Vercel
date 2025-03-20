"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, AlertCircle, Sparkles, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Import your API modules
import { getFinancialNews } from "@/lib/api/sentiment"
import { analyzeText } from "@/lib/api/openai"

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
}

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  // Fetch news from your API
  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getFinancialNews("stocks market finance")

        // Process only the first 6 articles to avoid too many API calls
        const processedNews = newsData.slice(0, 6).map((article: any, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          description: article.description,
          summary: article.description,
          url: article.url,
          source: article.source,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage,
        }))

        setNews(processedNews)

        // Try to analyze sentiment for each article
        try {
          // Analyze sentiment for each article (in parallel)
          const sentimentPromises = processedNews.map(async (article: NewsItem) => {
            try {
              const sentiment = await analyzeText(
                `Analyze the sentiment of this news headline: "${article.title}". Respond with only one word: positive, negative, or neutral.`,
              )
              return {
                ...article,
                sentiment: sentiment.toLowerCase().includes("positive")
                  ? "positive"
                  : sentiment.toLowerCase().includes("negative")
                    ? "negative"
                    : "neutral",
              }
            } catch (err) {
              console.error("Error analyzing sentiment:", err)
              return { ...article, sentiment: "neutral" }
            }
          })

          // Update news with sentiment analysis
          const newsWithSentiment = await Promise.all(sentimentPromises)
          setNews(newsWithSentiment)
        } catch (aiErr) {
          console.error("Error with sentiment analysis:", aiErr)
          setAiError("Sentiment analysis is currently unavailable. Showing news without sentiment indicators.")
          // Continue with the news without sentiment analysis
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load market news. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const getSentimentBadge = (sentiment?: NewsItem["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <Sparkles className="mr-1 h-3 w-3" /> Positive
          </Badge>
        )
      case "negative":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
            <AlertCircle className="mr-1 h-3 w-3" /> Negative
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

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-3 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No news available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {aiError && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{aiError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {news.map((item) => (
          <Card key={item.id || item.url} className="overflow-hidden card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                {getSentimentBadge(item.sentiment)}
              </div>
              <CardDescription className="flex items-center gap-1 text-xs">
                <span className="font-medium">{item.source.name}</span> •
                <Clock className="h-3 w-3 text-muted-foreground" />
                {new Date(item.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description || item.summary}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                Read more <ExternalLink className="h-3 w-3" />
              </a>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

