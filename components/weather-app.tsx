"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Navigation, Thermometer, Sunrise, Sunset } from "lucide-react"
import { WeatherIcon } from "@/components/weather-icon"
import { HourlyForecast } from "@/components/hourly-forecast"
import { DailyForecast } from "@/components/daily-forecast"

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
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
    sunrise: number
    sunset: number
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
  const w = weatherMain.toLowerCase()
  if (w.includes("clear") || w.includes("sun"))
    return "from-[#1a3a5c] via-[#2a5a8c] to-[#3a7abd]"
  if (w.includes("cloud"))
    return "from-[#2a3040] via-[#3a4560] to-[#4a5a78]"
  if (w.includes("rain") || w.includes("drizzle"))
    return "from-[#1a2030] via-[#253045] to-[#2a3d5a]"
  if (w.includes("snow"))
    return "from-[#2a3545] via-[#3a4a60] to-[#4a5f7a]"
  if (w.includes("thunder") || w.includes("storm"))
    return "from-[#151520] via-[#1f2035] to-[#2a2545]"
  if (w.includes("mist") || w.includes("fog") || w.includes("haze"))
    return "from-[#2a3040] via-[#3a4555] to-[#4a5568]"
  return "from-[#1a2035] via-[#253050] to-[#2a3d5a]"
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

export function WeatherApp() {
  const [city, setCity] = useState("San Francisco")
  const [searchInput, setSearchInput] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [geoLoading, setGeoLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError("")
    try {
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}&type=current`)
      if (!weatherRes.ok) throw new Error("City not found")
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
      if (!weatherRes.ok) throw new Error("Failed to fetch weather for your location")
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
      (geoError) => {
        setGeoLoading(false)
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions.")
            fetchWeather(city)
            break
          case geoError.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.")
            fetchWeather(city)
            break
          case geoError.TIMEOUT:
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput)
      setSearchInput("")
    }
  }

  const bgGradient = weather ? getWeatherBackground(weather.weather[0].main) : "from-[#1a2035] via-[#253050] to-[#2a3d5a]"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative animate-fade-in-up">
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300 ${
              searchFocused
                ? "bg-white/15 border border-white/25 shadow-lg shadow-black/10"
                : "bg-white/8 border border-white/10"
            }`}
          >
            <Search className="h-4 w-4 text-white/50 shrink-0" />
            <input
              type="text"
              placeholder="Search city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title="Use my location"
              aria-label="Use my location"
            >
              {geoLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 text-white/70" />
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="px-4 py-3 rounded-2xl bg-red-500/15 border border-red-400/20 animate-fade-in-up" role="alert">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
            </div>
            <p className="text-sm text-white/50 tracking-wide">Fetching weather data...</p>
          </div>
        ) : weather ? (
          <>
            {/* Main Current Weather */}
            <div className="text-center animate-fade-in-up">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-white/60" />
                <span className="text-sm text-white/60 tracking-wide">
                  {weather.name}, {weather.sys.country}
                </span>
              </div>
              <div className="flex items-center justify-center my-2">
                <WeatherIcon code={weather.weather[0].icon} size={72} />
              </div>
              <h1 className="text-8xl md:text-9xl font-extralight text-white tracking-tighter leading-none">
                {Math.round(weather.main.temp)}°
              </h1>
              <p className="text-base text-white/70 capitalize mt-2 tracking-wide">
                {weather.weather[0].description}
              </p>
              <div className="flex items-center justify-center gap-3 mt-2 text-sm text-white/50">
                <span>H: {Math.round(weather.main.temp_max)}°</span>
                <span className="w-px h-3 bg-white/20" />
                <span>L: {Math.round(weather.main.temp_min)}°</span>
              </div>
            </div>

            {/* Hourly Forecast */}
            {forecast && (
              <div className="animate-fade-in-up-delay-1">
                <HourlyForecast forecast={forecast} />
              </div>
            )}

            {/* Daily Forecast */}
            {forecast && (
              <div className="animate-fade-in-up-delay-2">
                <DailyForecast forecast={forecast} />
              </div>
            )}

            {/* Detail Cards Grid */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up-delay-3">
              <DetailCard
                icon={<Thermometer className="h-4 w-4" />}
                label="Feels Like"
                value={`${Math.round(weather.main.feels_like)}°`}
              />
              <DetailCard
                icon={<Droplets className="h-4 w-4" />}
                label="Humidity"
                value={`${weather.main.humidity}%`}
              />
              <DetailCard
                icon={<Wind className="h-4 w-4" />}
                label="Wind"
                value={`${Math.round(weather.wind.speed)} m/s`}
              />
              <DetailCard
                icon={<Gauge className="h-4 w-4" />}
                label="Pressure"
                value={`${weather.main.pressure} hPa`}
              />
              <DetailCard
                icon={<Eye className="h-4 w-4" />}
                label="Visibility"
                value={`${(weather.visibility / 1000).toFixed(1)} km`}
              />
              <DetailCard
                icon={<Sunrise className="h-4 w-4" />}
                label="Sunrise"
                value={formatTime(weather.sys.sunrise)}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="glass glass-hover rounded-2xl p-4 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white/40">{icon}</span>
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-light text-white tracking-tight">{value}</p>
    </div>
  )
}
