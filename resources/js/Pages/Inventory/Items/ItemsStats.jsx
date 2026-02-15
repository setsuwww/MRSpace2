export default function ItemsStats({
  title,
  value,
  secondValue = "",
  icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-4 py-6">
      <div className="flex items-center">
        <div className={`rounded-lg ${iconBg}`}>
          <div className={`p-2 ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="ml-3">
          <p className="text-xs text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-800">
            {value}
          </p>
          <p className="text-xs text-gray-400">{secondValue}</p>
        </div>
      </div>
    </div>
  )
}
