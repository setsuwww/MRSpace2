export default function ItemsStats({
  title,
  value,
  icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <div className={`w-5 h-5 ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="ml-3">
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
