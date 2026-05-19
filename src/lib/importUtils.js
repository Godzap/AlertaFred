import * as XLSX from 'xlsx'

export function formatName(raw) {
    if (!raw) return ''
    return String(raw)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

export function formatPhone(raw) {
    if (!raw) return ''
    const digits = String(raw).replace(/\D/g, '')

    let number = digits
    if (number.startsWith('55') && number.length === 13) number = number.slice(2)
    if (number.startsWith('55') && number.length === 12) number = number.slice(2)

    if (number.length === 11) {
        return `+55 (${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`
    }
    if (number.length === 10) {
        return `+55 (${number.slice(0, 2)}) ${number.slice(2, 6)}-${number.slice(6)}`
    }
    return String(raw).trim()
}

export function formatEmail(raw) {
    if (!raw) return ''
    return String(raw).trim().toLowerCase()
}

const NAME_KEYS = ['nome', 'name', 'nome_completo', 'full_name', 'contato', 'cliente', 'pessoa']
const PHONE_KEYS = ['telefone', 'celular', 'whatsapp', 'phone', 'mobile', 'tel', 'fone', 'numero', 'número']
const EMAIL_KEYS = ['email', 'e-mail', 'mail', 'correio', 'e_mail']

function detectKey(headers, candidates) {
    for (const h of headers) {
        const normalized = String(h).toLowerCase().trim().replace(/[^a-z_]/g, '')
        if (candidates.includes(normalized)) return h
    }
    return null
}

export async function parseSpreadsheet(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
                resolve(rows)
            } catch (err) {
                reject(err)
            }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}

export function detectAndMapContacts(rows) {
    if (!rows || rows.length === 0) return []

    const headers = Object.keys(rows[0])
    const nameKey = detectKey(headers, NAME_KEYS)
    const phoneKey = detectKey(headers, PHONE_KEYS)
    const emailKey = detectKey(headers, EMAIL_KEYS)

    return rows
        .map(row => ({
            name: nameKey ? formatName(row[nameKey]) : '',
            phone: phoneKey ? formatPhone(row[phoneKey]) : '',
            email: emailKey ? formatEmail(row[emailKey]) : '',
        }))
        .filter(r => r.name || r.phone)
}
