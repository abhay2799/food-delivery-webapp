export function RestaurantCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="h-48 bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-700 rounded w-1/4" />
          <div className="h-4 bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-700 rounded w-1/6" />
      </div>
      <div className="w-20 h-20 bg-gray-700 rounded-lg ml-4" />
    </div>
  );
}
