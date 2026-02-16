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
  const dailyData = forecast.list
    .reduce(
      (
        acc: Array<{ date: string; dt: number; temp: number; tempMin: number; tempMax: number; icon: string; weather: string }>,
        item,
      ) => {
        const date = new Date(item.dt * 1000).toDateString()
        const existing = acc.find((d) => d.date === date)
        if (!existing) {
          acc.push({
            date,
            dt: item.dt,
            temp: item.main.temp,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            icon: item.weather[0].icon,
            weather: item.weather[0].main,
          })
        } else {
          if (item.main.temp_min < existing.tempMin) existing.tempMin = item.main.temp_min
          if (item.main.temp_max > existing.tempMax) existing.tempMax = item.main.temp_max
        }
        return acc
      },
      [],
    )
    .slice(0, 5)

  const allTemps = dailyData.flatMap((d) => [d.tempMin, d.tempMax])
  const globalMin = Math.min(...allTemps)
  const globalMax = Math.max(...allTemps)
  const tempRange = globalMax - globalMin || 1

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4 px-1">5-Day Forecast</h3>
      <div className="flex flex-col">
        {dailyData.map((day, index) => {
          const date = new Date(day.dt * 1000)
          const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })

          const leftPos = ((day.tempMin - globalMin) / tempRange) * 100
          const rightPos = 100 - ((day.tempMax - globalMin) / tempRange) * 100

          return (
            <div
              key={day.dt}
              className={`flex items-center gap-3 py-3 px-1 ${
                index < dailyData.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <span className="text-sm text-white/70 w-12 shrink-0">{dayName}</span>
              <div className="shrink-0">
                <WeatherIcon code={day.icon} size={24} />
              </div>
              <span className="text-sm text-white/40 w-8 text-right shrink-0">{Math.round(day.tempMin)}°</span>
              {/* Temperature bar */}
              <div className="flex-1 h-1 rounded-full bg-white/10 relative mx-1">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-[#5b9bd5] to-[#e8a54b]"
                  style={{
                    left: `${leftPos}%`,
                    right: `${rightPos}%`,
                  }}
                />
              </div>
              <span className="text-sm text-white w-8 shrink-0">{Math.round(day.tempMax)}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
