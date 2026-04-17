export default function Toggle({ checked, onChange, label, size = 'md' }) {
    const sizes = {
        sm: { track: 'w-8 h-4', knob: 'w-3 h-3', translate: 'translate-x-4' },
        md: { track: 'w-10 h-5', knob: 'w-4 h-4', translate: 'translate-x-5' },
    }
    const s = sizes[size] || sizes.md

    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex items-center ${s.track} rounded-full transition-colors duration-200 ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}
            >
                <span
                    className={`inline-block ${s.knob} rounded-full bg-white shadow transition-transform duration-200 ml-0.5 ${checked ? s.translate : 'translate-x-0'}`}
                />
            </button>
            {label && <span className="text-sm text-gray-600">{label}</span>}
        </label>
    )
}
