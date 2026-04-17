/**
 * Substitui variáveis {name}, {phone}, {theme} no corpo de um template.
 * Se a variável não resolver, substitui por string vazia.
 */
export function renderTemplate(body, contact = {}) {
    if (!body) return ''
    return body
        .replace(/\{name\}/g, contact.name || '')
        .replace(/\{phone\}/g, contact.phone || '')
        .replace(/\{theme\}/g, contact.themes?.map(t => t.name).join(', ') || '')
}

/**
 * Destaca variáveis com span.tpl-var para exibição visual.
 */
export function highlightVariables(body) {
    if (!body) return ''
    return body.replace(/\{(name|phone|theme)\}/g, (match) => `<span class="tpl-var">${match}</span>`)
}
