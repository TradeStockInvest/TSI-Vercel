import axios from "axios"

const API_KEY = "090ce225346a41759e2f8dc03e0a1288"
const BASE_URL = "https://newsapi.org/v2"

// Fetch recent financial news articles
export async function getFinancialNews(query = "stocks") {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        apiKey: API_KEY,
      },
    })
    return response.data.articles
  } catch (error) {
    console.error("News API error:", error.response ? error.response.data : error.message)
    throw error
  }
}

