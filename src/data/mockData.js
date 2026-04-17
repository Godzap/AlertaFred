// ── Mock data para desenvolvimento frontend sem banco ──

export const mockUser = {
    id: 'user-001',
    email: 'enzo@zapcrm.com.br',
    user_metadata: { full_name: 'Enzo Baião' },
}

export const mockThemes = [
    { id: 'th-1', user_id: 'user-001', name: 'VIP', description: 'Contatos prioritários', color: '#1a5192', contact_count: 12 },
    { id: 'th-2', user_id: 'user-001', name: 'Clientes', description: 'Base de clientes ativa', color: '#10b981', contact_count: 47 },
    { id: 'th-3', user_id: 'user-001', name: 'Prospectos', description: 'Leads em avaliação', color: '#f59e0b', contact_count: 23 },
    { id: 'th-4', user_id: 'user-001', name: 'Parceiros', description: 'Empresas parceiras', color: '#8b5cf6', contact_count: 8 },
    { id: 'th-5', user_id: 'user-001', name: 'Fornecedores', description: 'Parceiros de suprimento', color: '#ef4444', contact_count: 15 },
]

export const mockTags = [
    { id: 'tg-1', user_id: 'user-001', name: 'Urgente', color: '#ef4444', contact_count: 5 },
    { id: 'tg-2', user_id: 'user-001', name: 'Follow-up', color: '#f59e0b', contact_count: 18 },
    { id: 'tg-3', user_id: 'user-001', name: 'Reunião', color: '#3b82f6', contact_count: 9 },
    { id: 'tg-4', user_id: 'user-001', name: 'Proposta', color: '#8b5cf6', contact_count: 7 },
    { id: 'tg-5', user_id: 'user-001', name: 'Contrato', color: '#10b981', contact_count: 14 },
    { id: 'tg-6', user_id: 'user-001', name: 'Inativo', color: '#6b7a8d', contact_count: 3 },
]

export const mockContacts = [
    {
        id: 'c-1', user_id: 'user-001', phone: '+5521987654321', name: 'Ana Souza',
        notes: 'Cliente desde 2022', status: 'active', source: 'manual',
        themes: [{ id: 'th-1', name: 'VIP', color: '#1a5192' }, { id: 'th-2', name: 'Clientes', color: '#10b981' }],
        tags: [{ id: 'tg-2', name: 'Follow-up', color: '#f59e0b' }],
        created_at: '2024-01-15T10:00:00Z',
    },
    {
        id: 'c-2', user_id: 'user-001', phone: '+5511976543210', name: 'Bruno Lima',
        notes: 'Interessado no plano premium', status: 'active', source: 'form',
        themes: [{ id: 'th-3', name: 'Prospectos', color: '#f59e0b' }],
        tags: [{ id: 'tg-4', name: 'Proposta', color: '#8b5cf6' }, { id: 'tg-1', name: 'Urgente', color: '#ef4444' }],
        created_at: '2024-02-20T14:30:00Z',
    },
    {
        id: 'c-3', user_id: 'user-001', phone: '+5531965432109', name: 'Carla Mendes',
        notes: '', status: 'active', source: 'manual',
        themes: [{ id: 'th-2', name: 'Clientes', color: '#10b981' }],
        tags: [{ id: 'tg-5', name: 'Contrato', color: '#10b981' }],
        created_at: '2024-03-05T09:15:00Z',
    },
    {
        id: 'c-4', user_id: 'user-001', phone: '+5541954321098', name: 'Diego Ferreira',
        notes: 'Parceiro estratégico', status: 'active', source: 'manual',
        themes: [{ id: 'th-4', name: 'Parceiros', color: '#8b5cf6' }],
        tags: [{ id: 'tg-3', name: 'Reunião', color: '#3b82f6' }],
        created_at: '2024-03-12T16:45:00Z',
    },
    {
        id: 'c-5', user_id: 'user-001', phone: '+5551943210987', name: 'Eduarda Costa',
        notes: 'Aguardando retorno', status: 'inactive', source: 'form',
        themes: [{ id: 'th-3', name: 'Prospectos', color: '#f59e0b' }],
        tags: [{ id: 'tg-6', name: 'Inativo', color: '#6b7a8d' }],
        created_at: '2024-04-01T11:00:00Z',
    },
    {
        id: 'c-6', user_id: 'user-001', phone: '+5561932109876', name: 'Felipe Rocha',
        notes: 'Número bloqueado', status: 'blocked', source: 'manual',
        themes: [],
        tags: [],
        created_at: '2024-04-10T08:30:00Z',
    },
    {
        id: 'c-7', user_id: 'user-001', phone: '+5571921098765', name: 'Gabriela Nunes',
        notes: 'VIP - prioridade máxima', status: 'active', source: 'manual',
        themes: [{ id: 'th-1', name: 'VIP', color: '#1a5192' }],
        tags: [{ id: 'tg-1', name: 'Urgente', color: '#ef4444' }, { id: 'tg-3', name: 'Reunião', color: '#3b82f6' }],
        created_at: '2024-04-18T13:20:00Z',
    },
    {
        id: 'c-8', user_id: 'user-001', phone: '+5581910987654', name: 'Henrique Matos',
        notes: 'Fornecedor de TI', status: 'active', source: 'import',
        themes: [{ id: 'th-5', name: 'Fornecedores', color: '#ef4444' }],
        tags: [{ id: 'tg-5', name: 'Contrato', color: '#10b981' }],
        created_at: '2024-05-02T15:00:00Z',
    },
]

export const mockTemplates = [
    {
        id: 'tpl-1', user_id: 'user-001', name: 'Boas-vindas',
        body: 'Olá {name}! 👋\n\nSeja bem-vindo(a) à nossa base de contatos. Estamos muito felizes em tê-lo(a) conosco.\n\nQualquer dúvida, pode entrar em contato pelo nosso canal oficial.',
        type: 'text', media_url: null,
        created_at: '2024-01-10T10:00:00Z',
    },
    {
        id: 'tpl-2', user_id: 'user-001', name: 'Lembrete de reunião',
        body: 'Oi {name}! 📅\n\nPassando para lembrar da nossa reunião marcada para hoje. Por favor confirme sua presença respondendo esta mensagem.\n\nAté logo!',
        type: 'text', media_url: null,
        created_at: '2024-01-20T14:00:00Z',
    },
    {
        id: 'tpl-3', user_id: 'user-001', name: 'Oferta especial VIP',
        body: 'Olá {name}! 🌟\n\nComo você faz parte do nosso grupo {theme}, preparamos uma oferta exclusiva para você.\n\nAcesse o link abaixo e aproveite:',
        type: 'text_link', media_url: 'https://exemplo.com/oferta-vip',
        created_at: '2024-02-05T09:00:00Z',
    },
    {
        id: 'tpl-4', user_id: 'user-001', name: 'Follow-up pós proposta',
        body: 'Oi {name}, tudo bem? 😊\n\nJá faz alguns dias desde que enviamos a proposta para o número {phone}. Gostaríamos de saber se tiver alguma dúvida ou quiser conversar sobre os detalhes.',
        type: 'text', media_url: null,
        created_at: '2024-02-15T11:30:00Z',
    },
    {
        id: 'tpl-5', user_id: 'user-001', name: 'Catálogo de produtos',
        body: 'Olá {name}! 📦\n\nSegue nosso catálogo atualizado com todos os produtos e serviços disponíveis. Qualquer item do seu interesse, entre em contato!',
        type: 'text_image', media_url: 'https://exemplo.com/catalogo.jpg',
        created_at: '2024-03-01T10:00:00Z',
    },
]

export const mockForms = [
    {
        id: 'frm-1', user_id: 'user-001', title: 'Cadastro de Evento', slug: 'cadastro-evento',
        description: 'Formulário de inscrição para o evento de networking',
        fields: [
            { name: 'name', label: 'Nome completo', type: 'text', required: true },
            { name: 'phone', label: 'WhatsApp', type: 'phone', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: false },
            { name: 'company', label: 'Empresa', type: 'text', required: false },
        ],
        auto_theme_id: 'th-3',
        confirmation_message: 'Inscrição realizada com sucesso! Entraremos em contato em breve.',
        active: true,
        submissions: 34,
        created_at: '2024-03-10T10:00:00Z',
    },
    {
        id: 'frm-2', user_id: 'user-001', title: 'Newsletter VIP', slug: 'newsletter-vip',
        description: 'Cadastre-se para receber novidades exclusivas',
        fields: [
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'phone', label: 'WhatsApp', type: 'phone', required: true },
            { name: 'interest', label: 'Área de interesse', type: 'select', required: false, options: ['Tecnologia', 'Negócios', 'Marketing'] },
        ],
        auto_theme_id: 'th-1',
        confirmation_message: 'Bem-vindo ao clube VIP! Em breve você receberá nossas novidades.',
        active: true,
        submissions: 18,
        created_at: '2024-04-01T10:00:00Z',
    },
    {
        id: 'frm-3', user_id: 'user-001', title: 'Pesquisa de satisfação', slug: 'pesquisa-satisfacao',
        description: 'Nos ajude a melhorar nossos serviços',
        fields: [
            { name: 'name', label: 'Nome', type: 'text', required: false },
            { name: 'phone', label: 'WhatsApp', type: 'phone', required: true },
            { name: 'rating', label: 'Avaliação (1-5)', type: 'number', required: true },
            { name: 'feedback', label: 'Comentário', type: 'textarea', required: false },
        ],
        auto_theme_id: null,
        confirmation_message: 'Obrigado pela sua avaliação!',
        active: false,
        submissions: 7,
        created_at: '2024-04-20T10:00:00Z',
    },
]

export const mockAlarms = [
    {
        id: 'al-1', user_id: 'user-001', name: 'Boas-vindas Automático',
        message_template_id: 'tpl-1',
        template: { name: 'Boas-vindas' },
        target_type: 'theme', target_value: ['th-3'],
        target_label: 'Tema: Prospectos',
        schedule_type: 'daily', schedule_times: ['09:00'],
        schedule_days_of_week: null, schedule_day_of_month: null, schedule_date: null,
        timezone: 'America/Sao_Paulo',
        status: 'active',
        next_run: '2026-04-16T09:00:00-03:00',
        last_run: '2026-04-15T09:00:00-03:00',
        schedule_label: 'Todo dia às 09:00',
        recipient_count: 23,
        created_at: '2024-01-15T10:00:00Z',
    },
    {
        id: 'al-2', user_id: 'user-001', name: 'Lembrete VIP Semanal',
        message_template_id: 'tpl-3',
        template: { name: 'Oferta especial VIP' },
        target_type: 'theme', target_value: ['th-1'],
        target_label: 'Tema: VIP',
        schedule_type: 'weekly', schedule_times: ['10:00'],
        schedule_days_of_week: [1, 3, 5],
        schedule_day_of_month: null, schedule_date: null,
        timezone: 'America/Sao_Paulo',
        status: 'active',
        next_run: '2026-04-17T10:00:00-03:00',
        last_run: '2026-04-15T10:00:00-03:00',
        schedule_label: 'Seg, Qua, Sex às 10:00',
        recipient_count: 12,
        created_at: '2024-02-01T10:00:00Z',
    },
    {
        id: 'al-3', user_id: 'user-001', name: 'Follow-up Mensal',
        message_template_id: 'tpl-4',
        template: { name: 'Follow-up pós proposta' },
        target_type: 'tag', target_value: ['tg-2'],
        target_label: 'Tag: Follow-up',
        schedule_type: 'monthly', schedule_times: ['14:00'],
        schedule_days_of_week: null, schedule_day_of_month: 1,
        schedule_date: null,
        timezone: 'America/Sao_Paulo',
        status: 'paused',
        next_run: null,
        last_run: '2026-04-01T14:00:00-03:00',
        schedule_label: 'Todo dia 1 do mês às 14:00',
        recipient_count: 18,
        created_at: '2024-03-01T10:00:00Z',
    },
    {
        id: 'al-4', user_id: 'user-001', name: 'Catálogo Quinzenal',
        message_template_id: 'tpl-5',
        template: { name: 'Catálogo de produtos' },
        target_type: 'all', target_value: [],
        target_label: 'Todos os contatos',
        schedule_type: 'multi_daily', schedule_times: ['08:00', '12:00', '18:00'],
        schedule_days_of_week: null, schedule_day_of_month: null, schedule_date: null,
        timezone: 'America/Sao_Paulo',
        status: 'active',
        next_run: '2026-04-15T12:00:00-03:00',
        last_run: '2026-04-15T08:00:00-03:00',
        schedule_label: '3x ao dia: 08:00, 12:00, 18:00',
        recipient_count: 105,
        created_at: '2024-04-01T10:00:00Z',
    },
]

export const mockSendLogs = [
    { id: 'sl-1', user_id: 'user-001', alarm_id: 'al-1', alarm_name: 'Boas-vindas Automático', contact_id: 'c-1', contact_name: 'Ana Souza', phone: '+5521987654321', message_body: 'Olá Ana Souza! 👋\n\nSeja bem-vindo(a)...', status: 'simulated', sent_at: '2026-04-15T09:00:12Z' },
    { id: 'sl-2', user_id: 'user-001', alarm_id: 'al-1', alarm_name: 'Boas-vindas Automático', contact_id: 'c-2', contact_name: 'Bruno Lima', phone: '+5511976543210', message_body: 'Olá Bruno Lima! 👋\n\nSeja bem-vindo(a)...', status: 'simulated', sent_at: '2026-04-15T09:00:13Z' },
    { id: 'sl-3', user_id: 'user-001', alarm_id: 'al-2', alarm_name: 'Lembrete VIP Semanal', contact_id: 'c-7', contact_name: 'Gabriela Nunes', phone: '+5571921098765', message_body: 'Olá Gabriela Nunes! 🌟\n\nComo você faz parte do grupo VIP...', status: 'simulated', sent_at: '2026-04-15T10:00:05Z' },
    { id: 'sl-4', user_id: 'user-001', alarm_id: 'al-4', alarm_name: 'Catálogo Quinzenal', contact_id: 'c-3', contact_name: 'Carla Mendes', phone: '+5531965432109', message_body: 'Olá Carla Mendes! 📦\n\nSegue nosso catálogo...', status: 'simulated', sent_at: '2026-04-15T08:00:30Z' },
    { id: 'sl-5', user_id: 'user-001', alarm_id: 'al-4', alarm_name: 'Catálogo Quinzenal', contact_id: 'c-4', contact_name: 'Diego Ferreira', phone: '+5541954321098', message_body: 'Olá Diego Ferreira! 📦\n\nSegue nosso catálogo...', status: 'simulated', sent_at: '2026-04-15T08:00:31Z' },
    { id: 'sl-6', user_id: 'user-001', alarm_id: null, alarm_name: null, contact_id: 'c-8', contact_name: 'Henrique Matos', phone: '+5581910987654', message_body: 'Olá Henrique! Catálogo em anexo.', status: 'simulated', sent_at: '2026-04-14T15:22:00Z' },
]

export const mockActivityLogs = [
    { id: 'act-1', action: 'contact_created', entity_type: 'contact', details: { contact_name: 'Henrique Matos' }, created_at: '2026-04-15T09:05:00Z' },
    { id: 'act-2', action: 'alarm_triggered', entity_type: 'alarm', details: { alarm_name: 'Boas-vindas Automático', count: 23 }, created_at: '2026-04-15T09:00:00Z' },
    { id: 'act-3', action: 'form_submitted', entity_type: 'form', details: { contact_name: 'João da Silva', form_title: 'Cadastro de Evento' }, created_at: '2026-04-14T18:32:00Z' },
    { id: 'act-4', action: 'template_created', entity_type: 'template', details: { template_name: 'Catálogo de produtos' }, created_at: '2026-04-14T11:10:00Z' },
    { id: 'act-5', action: 'contact_updated', entity_type: 'contact', details: { contact_name: 'Bruno Lima' }, created_at: '2026-04-13T16:45:00Z' },
    { id: 'act-6', action: 'alarm_paused', entity_type: 'alarm', details: { alarm_name: 'Follow-up Mensal' }, created_at: '2026-04-13T10:00:00Z' },
    { id: 'act-7', action: 'form_submitted', entity_type: 'form', details: { contact_name: 'Maria Santos', form_title: 'Newsletter VIP' }, created_at: '2026-04-12T14:20:00Z' },
    { id: 'act-8', action: 'message_sent', entity_type: 'send_log', details: { contact_name: 'Ana Souza', template_name: 'Oferta especial VIP' }, created_at: '2026-04-12T09:00:00Z' },
    { id: 'act-9', action: 'tag_created', entity_type: 'tag', details: { tag_name: 'Proposta' }, created_at: '2026-04-11T11:30:00Z' },
    { id: 'act-10', action: 'contact_created', entity_type: 'contact', details: { contact_name: 'Carla Mendes' }, created_at: '2026-04-10T08:00:00Z' },
]
