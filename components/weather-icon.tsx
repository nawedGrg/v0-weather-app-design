interface WeatherIconProps {
  code: string
  size?: number
  className?: string
}

export function WeatherIcon({ code, size = 48, className = "" }: WeatherIconProps) {
  // Map OpenWeatherMap condition codes to Material Icons
  const getIconName = (weatherCode: string): string => {
    const codeNum = weatherCode.substring(0, 2)

    switch (codeNum) {
      case "01": // Clear
        return weatherCode.includes("d") ? "wb_sunny" : "nightlight"
      case "02": // Few clouds
        return weatherCode.includes("d") ? "partly_cloudy_day" : "partly_cloudy_night"
      case "03": // Scattered clouds
      case "04": // Broken clouds
        return "cloud"
      case "09": // Shower rain
        return "rainy"
      case "10": // Rain
        return weatherCode.includes("d") ? "rainy" : "rainy"
      case "11": // Thunderstorm
        return "thunderstorm"
      case "13": // Snow
        return "ac_unit"
      case "50": // Mist/Fog
        return "foggy"
      default:
        return "wb_sunny"
    }
  }

  const iconName = getIconName(code)

  return (
    <span
      className={`material-symbols-outlined drop-shadow-lg ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48",
      }}
    >
      {iconName}
    </span>
  )
}
