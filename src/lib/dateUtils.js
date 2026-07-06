import { startOfWeek, addDays, addWeeks, format } from 'date-fns'

export function getWeekDays(refDate = new Date()) {
    const start = startOfWeek(refDate, { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function shiftWeek(refDate, delta) {
    return addWeeks(refDate, delta)
}

export function parseDDMM(str) {
    if (!str) return null
    const m = /^(\d{2})\/(\d{2})$/.exec(str.trim())
    if (!m) return null
    return { dd: m[1], mm: m[2] }
}

export function matchesDay(ddmm, date) {
    const parsed = parseDDMM(ddmm)
    if (!parsed) return false
    return parsed.dd === format(date, 'dd') && parsed.mm === format(date, 'MM')
}

export function maskDDMM(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function isSameDay(a, b) {
    return format(a, 'yyyy-MM-dd') === format(b, 'yyyy-MM-dd')
}

export const WEEKDAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
