export function Skeleton({ className = '' }) {
    return <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-7 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
        </div>
    )
}

export function SkeletonRow() {
    return (
        <tr>
            {[...Array(5)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    )
}
