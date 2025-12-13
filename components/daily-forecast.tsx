import { Card } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"

interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
      temp_min: number
      temp_max: number
    }
    weather: Array<{
      main: string
      icon: string
    }>
  }>
}

export function DailyForecast({ forecast }: { forecast: ForecastData }) {
  // Group by day and get one entry per day
  const dailyData = forecast.list
    .reduce((acc: any[], item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!acc.find((d) => d.date === date)) {
        acc.push({
          date,
          dt: item.dt,
          temp: item.main.temp,
          icon: item.weather[0].icon,
          weather: item.weather[0].main,
        })
      }
      return acc
    }, [])
    .slice(0, 5)

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {dailyData.map((day, index) => {
          const date = new Date(day.dt * 1000)
          const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span className="text-sm font-medium text-white min-w-[60px]">{dayName}</span>
              <div className="flex items-center gap-3 flex-1 justify-center">
                <WeatherIcon code={day.icon} size={40} />
                <span className="text-sm text-white/90">{day.weather}</span>
              </div>
              <span className="text-lg font-semibold text-white">{Math.round(day.temp)}°</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
