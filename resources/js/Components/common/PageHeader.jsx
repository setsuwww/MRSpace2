export default function PageHeader({ title, description, action, actionText = "Create", icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {action && (
        <button onClick={action} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {actionText}
        </button>
      )}
    </div>
  )
}
