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
    <div className="glass rounded-2xl p-4">
      <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4 px-1">Hourly Forecast</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
        {hourlyData.map((hour, index) => {
          const time = new Date(hour.dt * 1000)
          const hours = time.getHours()
          const ampm = hours >= 12 ? "PM" : "AM"
          const displayHours = hours % 12 || 12

          return (
            <div
              key={hour.dt}
              className="flex flex-col items-center gap-2 min-w-[68px] py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-xs text-white/50 font-medium">
                {index === 0 ? "Now" : `${displayHours}${ampm}`}
              </span>
              <WeatherIcon code={hour.weather[0].icon} size={28} />
              <span className="text-sm font-medium text-white">{Math.round(hour.main.temp)}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
