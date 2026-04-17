export default function StatsCard({ icon, label, value, delta, color = 'brand' }) {
    const colorMap = {
        brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
        green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
        red: { bg: 'bg-red-50', text: 'text-red-600' },
    }
    const c = colorMap[color] || colorMap.brand

    return (
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                    {icon}
                </div>
                {delta !== undefined && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {delta >= 0 ? '+' : ''}{delta}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {value}
            </div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
        </div>
    )
}
