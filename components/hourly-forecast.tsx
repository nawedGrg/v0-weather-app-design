import { Card } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"

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

export function HourlyForecast({ forecast }: { forecast: ForecastData }) {
  const hourlyData = forecast.list.slice(0, 8)

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {hourlyData.map((hour, index) => {
          const time = new Date(hour.dt * 1000)
          const hours = time.getHours()
          const ampm = hours >= 12 ? "PM" : "AM"
          const displayHours = hours % 12 || 12

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span className="text-sm text-white/80 whitespace-nowrap">
                {index === 0 ? "Now" : `${displayHours} ${ampm}`}
              </span>
              <WeatherIcon code={hour.weather[0].icon} size={40} />
              <span className="text-lg font-semibold text-white">{Math.round(hour.main.temp)}°</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
