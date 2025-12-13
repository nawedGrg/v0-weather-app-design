"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"
import { HourlyForecast } from "@/components/hourly-forecast"
import { DailyForecast } from "@/components/daily-forecast"

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  visibility: number
  name: string
  sys: {
    country: string
  }
}

interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      main: string
      icon: string
    }>
  }>
}

const getWeatherBackground = (weatherMain: string) => {
  const weatherLower = weatherMain.toLowerCase()

  if (weatherLower.includes("clear") || weatherLower.includes("sun")) {
    return "bg-gradient-to-br from-sky-400 via-blue-400 to-blue-500"
  } else if (weatherLower.includes("cloud")) {
    return "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600"
  } else if (weatherLower.includes("rain") || weatherLower.includes("drizzle")) {
    return "bg-gradient-to-br from-slate-600 via-slate-700 to-blue-900"
  } else if (weatherLower.includes("snow")) {
    return "bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300"
  } else if (weatherLower.includes("thunder") || weatherLower.includes("storm")) {
    return "bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900"
  } else if (weatherLower.includes("mist") || weatherLower.includes("fog") || weatherLower.includes("haze")) {
    return "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500"
  }

  return "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
}

export function WeatherApp() {
  const [city, setCity] = useState("San Francisco")
  const [searchInput, setSearchInput] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [geoLoading, setGeoLoading] = useState(false)

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError("")

    try {
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}&type=current`)

      if (!weatherRes.ok) {
        throw new Error("City not found")
      }

      const weatherData = await weatherRes.json()
      setWeather(weatherData)

      const forecastRes = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}&type=forecast`)
      const forecastData = await forecastRes.json()
      setForecast(forecastData)

      setCity(cityName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true)
    setError("")

    try {
      const weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`)

      if (!weatherRes.ok) {
        throw new Error("Failed to fetch weather for your location")
      }

      const weatherData = await weatherRes.json()
      setWeather(weatherData)

      const forecastRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`)
      const forecastData = await forecastRes.json()
      setForecast(forecastData)

      setCity(weatherData.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setGeoLoading(true)
    setError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherByCoords(latitude, longitude)
        setGeoLoading(false)
      },
      (error) => {
        setGeoLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions.")
            fetchWeather(city)
            break
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.")
            fetchWeather(city)
            break
          case error.TIMEOUT:
            setError("Location request timed out.")
            fetchWeather(city)
            break
          default:
            setError("An error occurred while getting your location.")
            fetchWeather(city)
        }
      },
    )
  }

  useEffect(() => {
    handleUseMyLocation()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput)
      setSearchInput("")
    }
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-1000 ${weather ? getWeatherBackground(weather.weather[0].main) : "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"}`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Weather</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md flex-1">
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/70"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30"
              title="Use my location"
            >
              {geoLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Navigation className="h-4 w-4 text-white" />
              )}
            </Button>
          </form>
        </div>

        {error && (
          <Card className="p-4 bg-red-500/20 backdrop-blur-md border-red-400/30">
            <p className="text-white">{error}</p>
          </Card>
        )}

        {loading ? (
          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </Card>
        ) : weather ? (
          <>
            {/* Current Weather */}
            <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-white/80 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {weather.name}, {weather.sys.country}
                    </span>
                  </div>
                  <h2 className="text-6xl md:text-7xl font-bold text-white">{Math.round(weather.main.temp)}°</h2>
                  <p className="text-lg text-white/90 capitalize mt-2">{weather.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <WeatherIcon code={weather.weather[0].icon} size={80} />
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Droplets className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Humidity</p>
                    <p className="text-lg font-semibold text-white">{weather.main.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Wind className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Wind Speed</p>
                    <p className="text-lg font-semibold text-white">{Math.round(weather.wind.speed)} m/s</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Visibility</p>
                    <p className="text-lg font-semibold text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Gauge className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Pressure</p>
                    <p className="text-lg font-semibold text-white">{weather.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Hourly Forecast */}
            {forecast && <HourlyForecast forecast={forecast} />}

            {/* Daily Forecast */}
            {forecast && <DailyForecast forecast={forecast} />}
          </>
        ) : null}
      </div>
    </div>
  )
}
