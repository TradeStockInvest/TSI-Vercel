import axios from "axios"

const API_KEY = "d_tL9q3986fTrp2Yz6jgyrzJKleBmAsO"
const BASE_URL = "https://api.polygon.io"

export async function getHistoricalData(ticker, from, to) {
  // Convert dates and calculate the difference in days.
  const fromDate = new Date(from)
  const toDate = new Date(to)
  const diffDays = (toDate - fromDate) / (1000 * 60 * 60 * 24)

  // If the requested range is more than one day, adjust to one day.
  if (diffDays > 1) {
    console.warn("Requested timeframe exceeds one day. Adjusting to a one-day range.")
    toDate.setDate(fromDate.getDate() + 1)
    to = toDate.toISOString().split("T")[0]
  }

  try {
    const response = await axios.get(`${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`, {
      params: {
        adjusted: true,
        sort: "asc",
        apiKey: API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error("Polygon.io error:", error.response ? error.response.data : error.message)
    throw error
  }
}

