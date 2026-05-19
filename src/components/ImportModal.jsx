import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Input from './ui/Input'
import MultiSelect from './ui/MultiSelect'
import { parseSpreadsheet, detectAndMapContacts } from '../lib/importUtils'

export default function ImportModal({ open, onClose, onImport, tags = [], themes = [] }) {
    const [step, setStep] = useState(1)
    const [origem, setOrigem] = useState('')
    const [file, setFile] = useState(null)
    const [tagIds, setTagIds] = useState([])
    const [themeIds, setThemeIds] = useState([])
    const [parsedRows, setParsedRows] = useState([])
    const [parsing, setParsing] = useState(false)
    const [parseError, setParseError] = useState('')
    const [importing, setImporting] = useState(false)
    const [dragging, setDragging] = useState(false)
    const fileRef = useRef(null)

    const tagOptions = tags.map(t => ({ value: t.id, label: t.name, color: t.color }))
    const themeOptions = themes.map(t => ({ value: t.id, label: t.name, color: t.color }))

    const reset = () => {
        setStep(1)
        setOrigem('')
        setFile(null)
        setTagIds([])
        setThemeIds([])
        setParsedRows([])
        setParseError('')
        setImporting(false)
    }

    const handleClose = () => { reset(); onClose() }

    const handleFileChange = (f) => {
        if (!f) return
        const allowed = ['.csv', '.xlsx', '.xls', '.ods', '.tsv']
        const ext = '.' + f.name.split('.').pop().toLowerCase()
        if (!allowed.includes(ext)) {
            setParseError('Formato não suportado. Use CSV, XLSX, XLS ou ODS.')
            return
        }
        setFile(f)
        setParseError('')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFileChange(f)
    }

    const handleAdvance = async () => {
        if (!file) { setParseError('Selecione um arquivo.'); return }
        setParsing(true)
        setParseError('')
        try {
            const rows = await parseSpreadsheet(file)
            const mapped = detectAndMapContacts(rows)
            if (mapped.length === 0) {
                setParseError('Nenhum contato encontrado. Verifique se a planilha tem colunas "nome" e "telefone".')
                setParsing(false)
                return
            }
            setParsedRows(mapped)
            setStep(2)
        } catch {
            setParseError('Erro ao ler o arquivo. Verifique se está corrompido.')
        }
        setParsing(false)
    }

    const handleImport = async () => {
        setImporting(true)
        try {
            const count = await onImport({ rows: parsedRows, tag_ids: tagIds, theme_ids: themeIds, origin: origem })
            reset()
            onClose(count)
        } catch {
            setImporting(false)
        }
    }

    return (
        <Modal open={open} onClose={handleClose} title="Importar contatos" size="lg">
            <div className="p-6">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                    {[1, 2].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                step >= s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {step > s ? <Check size={12} /> : s}
                            </div>
                            <span className={`text-xs ${step >= s ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                {s === 1 ? 'Configurar' : 'Confirmar'}
                            </span>
                            {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <Input
                            label="Origem"
                            value={origem}
                            onChange={e => setOrigem(e.target.value)}
                            placeholder="Ex: LinkedIn, Evento Março, Indicação..."
                        />

                        {/* File drop zone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Arquivo</label>
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                                    dragging ? 'border-brand-400 bg-brand-50' :
                                    file ? 'border-emerald-300 bg-emerald-50' :
                                    'border-gray-200 hover:border-brand-300 hover:bg-brand-50/40'
                                }`}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,.xlsx,.xls,.ods,.tsv"
                                    className="hidden"
                                    onChange={e => handleFileChange(e.target.files[0])}
                                />
                                {file ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileSpreadsheet size={28} className="text-emerald-500" />
                                        <p className="text-sm font-medium text-emerald-700">{file.name}</p>
                                        <p className="text-xs text-emerald-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload size={28} className="text-gray-300" />
                                        <p className="text-sm text-gray-500">Arraste ou clique para selecionar</p>
                                        <p className="text-xs text-gray-400">CSV, XLSX, XLS, ODS</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <MultiSelect
                            label="Temas (aplicados a todos os contatos importados)"
                            options={themeOptions}
                            value={themeIds}
                            onChange={setThemeIds}
                            placeholder="Selecionar temas..."
                        />
                        <MultiSelect
                            label="Tags (aplicadas a todos os contatos importados)"
                            options={tagOptions}
                            value={tagIds}
                            onChange={setTagIds}
                            placeholder="Selecionar tags..."
                        />

                        {parseError && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-sm">
                                <AlertCircle size={14} className="shrink-0" />
                                {parseError}
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-1">
                            <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
                            <Button onClick={handleAdvance} loading={parsing} disabled={!file}>
                                Avançar
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">{parsedRows.length}</span> contatos encontrados
                                {origem && <span className="text-gray-400"> · origem: <span className="text-gray-600">{origem}</span></span>}
                            </p>
                        </div>

                        {/* Preview table */}
                        <div className="border border-gray-100 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefone</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">E-mail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedRows.map((r, i) => (
                                        <tr key={i} className="border-t border-gray-50">
                                            <td className="px-4 py-2 text-gray-800">{r.name || <span className="text-gray-300 italic">—</span>}</td>
                                            <td className="px-4 py-2 text-gray-600 font-mono text-xs">{r.phone || <span className="text-gray-300 italic">—</span>}</td>
                                            <td className="px-4 py-2 text-gray-500 text-xs">{r.email || <span className="text-gray-300 italic">—</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-3 justify-end pt-1">
                            <Button type="button" variant="ghost" icon={<ArrowLeft size={14} />} onClick={() => setStep(1)}>
                                Voltar
                            </Button>
                            <Button onClick={handleImport} loading={importing}>
                                Importar {parsedRows.length} contatos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
