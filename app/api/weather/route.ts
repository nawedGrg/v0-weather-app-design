import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.WEATHER_API_KEY || "1eb51a21a8cbde90c5efd65c0c4c23fa"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const type = searchParams.get("type") // 'current' or 'forecast'

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: "City or coordinates are required" }, { status: 400 })
  }

  try {
    let url: string
    if (type === "forecast") {
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      }
    } else {
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      }
    }

    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "City not found" }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
