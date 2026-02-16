interface WeatherIconProps {
  code: string
  size?: number
  className?: string
}

export function WeatherIcon({ code, size = 48, className = "" }: WeatherIconProps) {
  const getIconName = (weatherCode: string): string => {
    const codeNum = weatherCode.substring(0, 2)
    switch (codeNum) {
      case "01":
        return weatherCode.includes("d") ? "wb_sunny" : "nightlight"
      case "02":
        return weatherCode.includes("d") ? "partly_cloudy_day" : "partly_cloudy_night"
      case "03":
      case "04":
        return "cloud"
      case "09":
        return "rainy"
      case "10":
        return "rainy"
      case "11":
        return "thunderstorm"
      case "13":
        return "ac_unit"
      case "50":
        return "foggy"
      default:
        return "wb_sunny"
    }
  }

  const getIconColor = (weatherCode: string): string => {
    const codeNum = weatherCode.substring(0, 2)
    switch (codeNum) {
      case "01":
        return weatherCode.includes("d") ? "#FFD54F" : "#B0BEC5"
      case "02":
        return weatherCode.includes("d") ? "#FFE082" : "#90A4AE"
      case "03":
      case "04":
        return "#B0BEC5"
      case "09":
      case "10":
        return "#80DEEA"
      case "11":
        return "#CE93D8"
      case "13":
        return "#E0E0E0"
      case "50":
        return "#B0BEC5"
      default:
        return "#FFD54F"
    }
  }

  const iconName = getIconName(code)
  const iconColor = getIconColor(code)

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: `${size}px`,
        color: iconColor,
        fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48",
        filter: `drop-shadow(0 0 ${size / 4}px ${iconColor}40)`,
      }}
      aria-hidden="true"
    >
      {iconName}
    </span>
  )
}
