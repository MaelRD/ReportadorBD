// Mostrar Fecha Actual
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('es-ES', options);
}
updateDate();

// Navegación entre Vistas
const navReports = document.getElementById('nav-reports');
const navMinutas = document.getElementById('nav-minutas');
const viewReports = document.getElementById('view-reports');
const viewMinutas = document.getElementById('view-minutas');

// Mostrar/Ocultar Menú Móvil
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function toggleMobileMenu() {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        sidebarOverlay.classList.add('active');
    } else {
        sidebarOverlay.classList.remove('active');
    }
}

function closeMobileMenu() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
sidebarOverlay.addEventListener('click', closeMobileMenu);

navReports.addEventListener('click', (e) => {
    e.preventDefault();
    navReports.classList.add('active');
    navMinutas.classList.remove('active');
    viewReports.style.display = 'block';
    viewMinutas.style.display = 'none';
    document.getElementById('view-qr').style.display = 'none';
    document.getElementById('view-calendar').style.display = 'none';
    if (window.innerWidth <= 768) closeMobileMenu();
});

navMinutas.addEventListener('click', (e) => {
    e.preventDefault();
    navMinutas.classList.add('active');
    navReports.classList.remove('active');
    viewMinutas.style.display = 'block';
    viewReports.style.display = 'none';
    document.getElementById('view-qr').style.display = 'none';
    document.getElementById('view-calendar').style.display = 'none';
    if (window.innerWidth <= 768) closeMobileMenu();
});


// Mostrar/Ocultar Campos de Juntas
document.getElementById('has-meetings').addEventListener('change', function (e) {
    const container = document.getElementById('meetings-container');
    if (e.target.checked) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
});

// Tickets Dinámicos
let ticketCount = 0;
const ticketsContainer = document.getElementById('tickets-container');
const btnAddTicket = document.getElementById('btn-add-ticket');

function createTicketElement() {
    ticketCount++;
    const div = document.createElement('div');
    div.className = 'ticket-item';
    div.id = `ticket-${ticketCount}`;

    div.innerHTML = `
        <div class="ticket-header">
            <strong>Ticket #${ticketCount}</strong>
            <button type="button" class="btn-remove-ticket" onclick="removeTicket(${ticketCount})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="ticket-fields">
            <div>
                <input type="text" class="ticket-id-input" placeholder="Ej: TICKET-1205" required>
            </div>
            <div>
                <select class="ticket-status-input">
                    <option value="Levantado (Nuevo)">Levantado (Nuevo)</option>
                    <option value="Pendiente Cliente">Pendiente Cliente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Bloqueado">Bloqueado</option>
                </select>
            </div>
        </div>
        <div class="action-field">
            <input type="text" class="ticket-action-input" placeholder="Ej: Revisar logs; el cliente reporta lentitud..." required>
        </div>
    `;
    return div;
}

// Agregar Primer Ticket Automáticamente
ticketsContainer.appendChild(createTicketElement());

btnAddTicket.addEventListener('click', () => {
    ticketsContainer.appendChild(createTicketElement());
});

window.removeTicket = function (id) {
    const el = document.getElementById(`ticket-${id}`);
    if (el) {
        el.remove();
    }
}

// Acuerdos Dinámicos
let agreementCount = 0;
const agreementsContainer = document.getElementById('agreements-container');
const btnAddAgreement = document.getElementById('btn-add-agreement');

function createAgreementElement() {
    agreementCount++;
    const div = document.createElement('div');
    div.className = 'agreement-item';
    div.id = `agreement-${agreementCount}`;

    div.innerHTML = `
        <div class="agreement-header">
            <strong>Acuerdo #${agreementCount}</strong>
            <button type="button" class="btn-remove-ticket" onclick="removeAgreement(${agreementCount})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="agreement-fields">
            <div>
                <input type="text" class="agreement-task-input" placeholder="Tarea / Acción" required>
            </div>
            <div>
                <input type="text" class="agreement-who-input" placeholder="Responsable" required>
            </div>
            <div>
                <input type="date" class="agreement-date-input" required>
            </div>
        </div>
    `;
    return div;
}

// Agregar Primer Acuerdo Automáticamente
if (agreementsContainer && btnAddAgreement) {
    agreementsContainer.appendChild(createAgreementElement());
    btnAddAgreement.addEventListener('click', () => {
        agreementsContainer.appendChild(createAgreementElement());
    });
}

window.removeAgreement = function (id) {
    const el = document.getElementById(`agreement-${id}`);
    if (el) {
        el.remove();
    }
}

// PDF Generation Logic
document.getElementById('btn-generate-pdf').addEventListener('click', async () => {
    // Recolectar Campos
    const author = document.getElementById('report-author').value;
    const context = document.getElementById('report-context').value;
    const state = document.getElementById('report-state').value;
    const event = document.getElementById('report-event').value;
    const notes = document.getElementById('report-notes').value;

    if (!author || !context || !event) {
        alert("Por favor, completa Nombre, Contexto y Evento principal.");
        return;
    }

    // Cambiar Estado del Botón
    const btn = document.getElementById('btn-generate-pdf');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
    btn.disabled = true;

    try {
        // Llenar Variables del PDF
        document.getElementById('pdf-date-text').textContent = new Date().toLocaleDateString('es-ES', { dateStyle: 'long' });
        document.getElementById('pdf-author-text').textContent = author;
        document.getElementById('pdf-footer-date').textContent = new Date().toLocaleString('es-ES');

        document.getElementById('pdf-context-text').textContent = context;
        document.getElementById('pdf-event-text').textContent = event;

        // Estilizar Estado General
        const stateEl = document.getElementById('pdf-state-text');
        const stateSelect = document.getElementById('report-state');
        stateEl.textContent = stateSelect.options[stateSelect.selectedIndex].text;

        if (state === 'Tranquilo') {
            stateEl.style.backgroundColor = '#dcfce7';
            stateEl.style.color = '#166534';
            stateEl.style.border = '1px solid #bbf7d0';
        } else if (state === 'Normal') {
            stateEl.style.backgroundColor = '#e0f2fe';
            stateEl.style.color = '#075985';
            stateEl.style.border = '1px solid #bae6fd';
        } else if (state === 'Pesado') {
            stateEl.style.backgroundColor = '#fef08a';
            stateEl.style.color = '#854d0e';
            stateEl.style.border = '1px solid #fde047';
        } else {
            stateEl.style.backgroundColor = '#fee2e2';
            stateEl.style.color = '#991b1b';
            stateEl.style.border = '1px solid #fecaca';
        }

        // Construir Filas de Tickets
        const tbody = document.getElementById('pdf-tickets-table-body');
        tbody.innerHTML = '';

        const ticketItems = document.querySelectorAll('.ticket-item');
        if (ticketItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#94a3b8; font-weight:500;">Ningún ticket levantado o resuelto</td></tr>';
        } else {
            ticketItems.forEach(item => {
                const tId = item.querySelector('.ticket-id-input').value || '-';
                const tStatus = item.querySelector('.ticket-status-input').value || '-';
                const tAction = item.querySelector('.ticket-action-input').value || '-';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${tId}</strong></td>
                    <td>${tStatus}</td>
                    <td>${tAction}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Visibilidad de Consultas y Capacitaciones
        const queriesSection = document.getElementById('pdf-queries-section');
        if (notes.trim() === '') {
            queriesSection.style.display = 'none';
        } else {
            queriesSection.style.display = 'block';
            document.getElementById('pdf-notes-text').textContent = notes;
        }

        // Visibilidad de Agenda de Juntas
        const meetingsSection = document.getElementById('pdf-meetings-section');
        const hasMeetings = document.getElementById('has-meetings').checked;
        if (!hasMeetings) {
            meetingsSection.style.display = 'none';
        } else {
            meetingsSection.style.display = 'block';

            const meetingTime = document.getElementById('meeting-datetime').value;
            const meetingMinuta = document.getElementById('meeting-minuta').value;

            let formattedTime = meetingTime;
            if (meetingTime) {
                const dt = new Date(meetingTime);
                formattedTime = dt.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
            }

            document.getElementById('pdf-meeting-time').textContent = formattedTime || 'No especificada';
            document.getElementById('pdf-meeting-minuta').textContent = meetingMinuta || 'Sin detalles adicionales.';
        }

        // Generar PDF
        const element = document.getElementById('pdf-template');

        // Incluir Fecha en Nombre del Archivo
        const todayStr = new Date().toISOString().split('T')[0];
        const opt = {
            margin: 0,
            filename: `EntregaTurno_${author.replace(/\s+/g, '')}_${todayStr}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Guardar Archivo Asegurando Carga Sincrona
        await html2pdf().set(opt).from(element).save();

        // Mostrar Alerta de Éxito
        setTimeout(() => alert("Reporte de entrega guardado en tus Descargas."), 500);

    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Ocurrió un error al generar el reporte.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// Generación de PDF: Minuta
const btnGenerateMinutaPdf = document.getElementById('btn-generate-minuta-pdf');
if (btnGenerateMinutaPdf) {
    btnGenerateMinutaPdf.addEventListener('click', async () => {
        const title = document.getElementById('minuta-title').value;
        const dateStr = document.getElementById('minuta-date').value;
        const timeStr = document.getElementById('minuta-time').value;
        const typeMode = document.getElementById('minuta-type').value;
        const notes = document.getElementById('minuta-notes').value;

        if (!title || !dateStr || !timeStr || !notes) {
            alert("Por favor, completa los campos requeridos.");
            return;
        }

        const btn = document.getElementById('btn-generate-minuta-pdf');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
        btn.disabled = true;

        try {
            document.getElementById('pdf-minuta-title-text').textContent = title;
            document.getElementById('pdf-minuta-date-text').textContent = dateStr;
            document.getElementById('pdf-minuta-time-text').textContent = timeStr;
            document.getElementById('pdf-minuta-type-text').textContent = typeMode;
            document.getElementById('pdf-minuta-notes-text').textContent = notes;
            document.getElementById('pdf-minuta-footer-date').textContent = new Date().toLocaleString('es-ES');

            const tbody = document.getElementById('pdf-agreements-table-body');
            tbody.innerHTML = '';

            const agreementItems = document.querySelectorAll('.agreement-item');
            if (agreementItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#94a3b8; font-weight:500;">No hay acuerdos registrados</td></tr>';
            } else {
                agreementItems.forEach(item => {
                    const task = item.querySelector('.agreement-task-input').value || '-';
                    const who = item.querySelector('.agreement-who-input').value || '-';
                    const endDate = item.querySelector('.agreement-date-input').value || '-';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${task}</strong></td>
                        <td>${who}</td>
                        <td>${endDate}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }

            const element = document.getElementById('pdf-template-minuta');
            const todayStr = new Date().toISOString().split('T')[0];
            const opt = {
                margin: 0,
                filename: `Minuta_${title.replace(/\s+/g, '')}_${todayStr}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
            setTimeout(() => alert("Minuta guardada en tus Descargas."), 500);

        } catch (err) {
            console.error("Error generating Minuta PDF:", err);
            alert("Ocurrió un error al generar la Minuta.");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
// Generador QR
const navQr = document.getElementById('nav-qr');
const viewQr = document.getElementById('view-qr');

navQr.addEventListener('click', (e) => {
    e.preventDefault();
    navQr.classList.add('active');
    navReports.classList.remove('active');
    navMinutas.classList.remove('active');
    viewQr.style.display = 'block';
    viewReports.style.display = 'none';
    viewMinutas.style.display = 'none';
    if (window.innerWidth <= 768) closeMobileMenu();
});

// Actualizar también navReports y navMinutas para quitar nav-qr active
navReports.addEventListener('click', () => { navQr.classList.remove('active'); });
navMinutas.addEventListener('click', () => { navQr.classList.remove('active'); });

// Selector de tipo QR
let currentQrType = 'texto';
const qrTypeBtns = document.querySelectorAll('.qr-type-btn');
const qrFieldGroups = document.querySelectorAll('.qr-field-group');

qrTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        qrTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentQrType = btn.dataset.type;

        qrFieldGroups.forEach(g => g.style.display = 'none');
        document.getElementById(`qr-field-${currentQrType}`).style.display = 'block';
    });
});

// Slider de tamaño
const qrSizeSlider = document.getElementById('qr-size');
const qrSizeLabel = document.getElementById('qr-size-label');
qrSizeSlider.addEventListener('input', () => {
    qrSizeLabel.textContent = `${qrSizeSlider.value}px`;
});

// Construir datos QR según tipo
function buildQrData() {
    switch (currentQrType) {
        case 'texto': {
            const val = document.getElementById('qr-input-texto').value.trim();
            if (!val) return null;
            return val;
        }
        case 'email': {
            const email = document.getElementById('qr-input-email').value.trim();
            if (!email) return null;
            const subject = encodeURIComponent(document.getElementById('qr-input-subject').value.trim());
            const body = encodeURIComponent(document.getElementById('qr-input-body').value.trim());
            let mailto = `mailto:${email}`;
            const params = [];
            if (subject) params.push(`subject=${subject}`);
            if (body) params.push(`body=${body}`);
            if (params.length) mailto += `?${params.join('&')}`;
            return mailto;
        }
        case 'telefono': {
            const tel = document.getElementById('qr-input-telefono').value.trim().replace(/\s+/g, '');
            if (!tel) return null;
            const action = document.querySelector('input[name="tel-action"]:checked').value;
            return `${action}:${tel}`;
        }
        case 'url': {
            let url = document.getElementById('qr-input-url').value.trim();
            if (!url) return null;
            if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
            return url;
        }
        default:
            return null;
    }
}

// Referencia global al QR para descarga
let lastQrCanvas = null;

document.getElementById('btn-generate-qr').addEventListener('click', () => {
    const data = buildQrData();
    if (!data) {
        alert('Por favor, completa el campo requerido.');
        return;
    }

    const size = parseInt(qrSizeSlider.value);
    const colorDark = document.getElementById('qr-color-dark').value;
    const colorLight = document.getElementById('qr-color-light').value;

    const container = document.getElementById('qr-canvas-container');
    container.innerHTML = '';

    new QRCode(container, {
        text: data,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Guardar referencia al canvas generado
    lastQrCanvas = container.querySelector('canvas');

    // Mostrar vista previa del dato codificado
    const preview = document.getElementById('qr-data-preview');
    preview.textContent = data.length > 80 ? data.substring(0, 80) + '…' : data;

    document.getElementById('qr-result-panel').style.display = 'flex';
    document.getElementById('qr-result-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Descargar QR como PNG
document.getElementById('btn-download-qr').addEventListener('click', () => {
    if (!lastQrCanvas) return;
    const link = document.createElement('a');
    link.download = 'codigo-qr.png';
    link.href = lastQrCanvas.toDataURL('image/png');
    link.click();
});

// Generar otro (limpiar)
document.getElementById('btn-new-qr').addEventListener('click', () => {
    document.getElementById('qr-result-panel').style.display = 'none';
    document.getElementById('qr-canvas-container').innerHTML = '';
    lastQrCanvas = null;
    // Limpiar campos
    document.getElementById('qr-input-texto').value = '';
    document.getElementById('qr-input-email').value = '';
    document.getElementById('qr-input-subject').value = '';
    document.getElementById('qr-input-body').value = '';
    document.getElementById('qr-input-telefono').value = '';
    document.getElementById('qr-input-url').value = '';
});

// ==============================================
// MÓDULO DE CALENDARIO · Horarios de Trabajo
// ==============================================

// ── Constantes ──────────────────────────────
const PERSONAS = ['Mario', 'Allan'];
const TIPOS = ['Presencial', 'Virtual'];
const COLOR_PER = { Mario: 'blue', Allan: 'green' };
const HEX_PER = { Mario: '#3b82f6', Allan: '#10b981' };
const DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// ── Estado ───────────────────────────────────
let calOffset = 0;
let calShifts = [];

// URL base de la API (mismo origen cuando corre con el servidor Python)
const API_BASE = '/api';

// ── Cargar turnos desde la API ────────────────
async function loadShifts() {
    try {
        const res = await fetch(`${API_BASE}/shifts`);
        if (!res.ok) throw new Error('API no disponible');
        calShifts = await res.json();
        localStorage.setItem('cal_shifts_v2', JSON.stringify(calShifts));
    } catch {
        calShifts = JSON.parse(localStorage.getItem('cal_shifts_v2') || '[]');
        console.warn('Servidor no disponible, usando datos locales.');
    }
}

// ── Guardar turno en la API ───────────────────
async function saveShiftAPI(data) {
    try {
        const res = await fetch(`${API_BASE}/shifts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Error al guardar');
        const idx = calShifts.findIndex(s => s.id === data.id);
        if (idx >= 0) calShifts[idx] = data;
        else calShifts.push(data);
        localStorage.setItem('cal_shifts_v2', JSON.stringify(calShifts));
        return true;
    } catch (err) {
        console.error('Error guardando turno:', err);
        alert('No se pudo guardar en la base de datos. Verifica la conexión al servidor.');
        return false;
    }
}

// ── Eliminar turno en la API ──────────────────
async function deleteShiftAPI(id) {
    try {
        const res = await fetch(`${API_BASE}/shifts/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        calShifts = calShifts.filter(s => s.id !== id);
        localStorage.setItem('cal_shifts_v2', JSON.stringify(calShifts));
        return true;
    } catch (err) {
        console.error('Error eliminando turno:', err);
        alert('No se pudo eliminar del servidor. Verifica la conexión.');
        return false;
    }
}

// ── Elementos DOM ────────────────────────────
const navCal = document.getElementById('nav-calendar');
const viewCal = document.getElementById('view-calendar');

// ── Utilidades de fecha ──────────────────────
function toISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getWeek(offset) {
    const today = new Date();
    const dow = today.getDay();
    const diff = (dow === 0 ? -6 : 1 - dow) + offset * 7;
    const mon = new Date(today);
    mon.setDate(today.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
}
function minutesBetween(a, b) {
    if (!a || !b) return 0;
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    const d = (bh * 60 + bm) - (ah * 60 + am);
    return d > 0 ? d : 0;
}
function fmtMins(m) {
    if (!m || m <= 0) return '—';
    const h = Math.floor(m / 60), r = m % 60;
    return r ? `${h}h ${r}m` : `${h}h`;
}

// ── Guardar en localStorage ──────────────────
function saveShifts() {
    localStorage.setItem('cal_shifts_v2', JSON.stringify(calShifts));
}

// ── Navegación ───────────────────────────────
function showAllViews(hide) {
    ['view-reports', 'view-minutas', 'view-qr', 'view-calendar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

navCal.addEventListener('click', async e => {
    e.preventDefault();
    showAllViews();
    viewCal.style.display = 'block';
    navCal.classList.add('active');
    await loadShifts();
    renderCal();
    if (window.innerWidth <= 768) closeMobileMenu();
});

// Ocultar calendario al navegar a otras secciones
['nav-reports', 'nav-minutas', 'nav-qr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => {
        viewCal.style.display = 'none';
        navCal.classList.remove('active');
    });
});

// ── Render principal ─────────────────────────
function renderCal() {
    const week = getWeek(calOffset);
    const todayS = toISO(new Date());

    // Etiqueta de semana
    const [f, l] = [week[0], week[6]];
    const label = f.getMonth() === l.getMonth()
        ? `${f.getDate()} – ${l.getDate()} de ${MONTHS_ES[f.getMonth()]} ${f.getFullYear()}`
        : `${f.getDate()} ${MONTHS_ES[f.getMonth()]} – ${l.getDate()} ${MONTHS_ES[l.getMonth()]} ${l.getFullYear()}`;
    document.getElementById('cal-week-label').textContent = label;

    // Grid de días
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    // Acumuladores
    const acc = {};
    PERSONAS.forEach(p => { acc[p] = { Presencial: 0, Virtual: 0, total: 0 }; });

    week.forEach((date, idx) => {
        const dateS = toISO(date);
        const isToday = dateS === todayS;

        const col = document.createElement('div');
        col.className = 'sched-day' + (isToday ? ' sched-today' : '');

        // Encabezado del día
        const header = document.createElement('div');
        header.className = 'sched-day-head';
        header.innerHTML = `
            <span class="sched-day-name">${DAYS_ES[idx].substring(0, 3).toUpperCase()}</span>
            <span class="sched-day-num">${date.getDate()}</span>
        `;
        col.appendChild(header);

        // Turnos del día
        const body = document.createElement('div');
        body.className = 'sched-day-body';

        const dayShifts = calShifts
            .filter(s => s.date === dateS)
            .sort((a, b) => (a.start || '').localeCompare(b.start || ''));

        dayShifts.forEach(s => {
            const mins = minutesBetween(s.start, s.end);
            const card = document.createElement('div');
            card.className = `sched-shift shift-${COLOR_PER[s.person] || 'blue'}`;
            card.dataset.id = s.id;

            const icon = s.tipo === 'Virtual'
                ? '<i class="fa-solid fa-laptop"></i>'
                : '<i class="fa-solid fa-building"></i>';

            card.innerHTML = `
                <div class="sched-shift-top">
                    <strong class="sched-person">${s.person}</strong>
                    <span class="sched-tipo">${icon} ${s.tipo}</span>
                </div>
                <div class="sched-time">
                    ${s.start && s.end ? `${s.start} – ${s.end}` : s.start || ''}
                    ${mins > 0 ? `<span class="sched-dur">${fmtMins(mins)}</span>` : ''}
                </div>
                ${s.note ? `<div class="sched-note">${s.note}</div>` : ''}
            `;
            card.addEventListener('click', () => openModal(dateS, s));
            body.appendChild(card);

            // Acumular horas
            if (s.person && acc[s.person] && mins > 0) {
                const t = s.tipo === 'Virtual' ? 'Virtual' : 'Presencial';
                acc[s.person][t] += mins;
                acc[s.person].total += mins;
            }
        });

        // Botón para agregar turno
        const addBtn = document.createElement('button');
        addBtn.className = 'sched-add-btn';
        addBtn.dataset.date = dateS;
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        addBtn.title = 'Agregar turno';
        addBtn.addEventListener('click', () => openModal(dateS, null));
        body.appendChild(addBtn);

        col.appendChild(body);
        grid.appendChild(col);
    });

    renderSummary(acc);
}

// ── Panel de resumen ─────────────────────────
function renderSummary(acc) {
    const panel = document.getElementById('cal-summary');
    panel.innerHTML = `
        <div class="sum-title"><i class="fa-solid fa-chart-bar"></i> Resumen de la semana</div>
        <div class="sum-grid">
            ${PERSONAS.map(p => `
            <div class="sum-card" style="border-top: 3px solid ${HEX_PER[p]};">
                <div class="sum-person" style="color:${HEX_PER[p]};">
                    <i class="fa-solid fa-user-clock"></i> ${p}
                </div>
                <div class="sum-rows">
                    <div class="sum-row">
                        <span><i class="fa-solid fa-building"></i> Presencial</span>
                        <b>${fmtMins(acc[p].Presencial)}</b>
                    </div>
                    <div class="sum-row">
                        <span><i class="fa-solid fa-laptop"></i> Virtual</span>
                        <b>${fmtMins(acc[p].Virtual)}</b>
                    </div>
                    <div class="sum-row sum-total">
                        <span>Total</span>
                        <b>${fmtMins(acc[p].total)}</b>
                    </div>
                </div>
            </div>`).join('')}
        </div>
    `;
}

// ── Modal ─────────────────────────────────────────────────
function openModal(dateS, shift) {
    const overlay = document.getElementById('cal-overlay');
    const dateInput = document.getElementById('cal-shift-date');

    document.getElementById('cal-shift-id').value = shift ? shift.id : '';
    dateInput.value = shift ? shift.date : (dateS || toISO(new Date()));
    document.getElementById('cal-shift-person').value = shift ? shift.person : 'Mario';
    document.getElementById('cal-shift-tipo').value = shift ? shift.tipo : 'Presencial';
    document.getElementById('cal-shift-start').value = shift ? (shift.start || '') : '';
    document.getElementById('cal-shift-end').value = shift ? (shift.end || '') : '';
    document.getElementById('cal-shift-note').value = shift ? (shift.note || '') : '';

    document.getElementById('cal-modal-titulo').textContent = shift ? 'Editar Turno' : 'Registrar Turno';
    document.getElementById('cal-modal-fecha').textContent = formatDateLabel(dateInput.value);
    document.getElementById('cal-del-btn').style.display = shift ? 'flex' : 'none';

    // Actualizar el label del encabezado al cambiar la fecha
    dateInput.onchange = () => {
        document.getElementById('cal-modal-fecha').textContent = formatDateLabel(dateInput.value);
    };

    overlay.style.display = 'flex';
    overlay.classList.add('open');

    // Si no hay fecha de contexto (botón global), enfocar la fecha
    if (!dateS && !shift) {
        dateInput.focus();
    } else {
        document.getElementById('cal-shift-start').focus();
    }
}

function closeModal() {
    const overlay = document.getElementById('cal-overlay');
    overlay.classList.remove('open');
    overlay.style.display = 'none';
}

function formatDateLabel(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dow = date.getDay();
    const dayName = DAYS_ES[dow === 0 ? 6 : dow - 1];
    return `${dayName} ${d} de ${MONTHS_ES[m - 1]}`;
}

// Guardar turno
document.getElementById('cal-save-btn').addEventListener('click', async () => {
    const date = document.getElementById('cal-shift-date').value;
    const person = document.getElementById('cal-shift-person').value;
    const tipo = document.getElementById('cal-shift-tipo').value;
    const start = document.getElementById('cal-shift-start').value;
    const end = document.getElementById('cal-shift-end').value;
    const note = document.getElementById('cal-shift-note').value.trim();

    if (!date || !person) { alert('Selecciona la persona y la fecha.'); return; }

    const id = document.getElementById('cal-shift-id').value || `sh-${Date.now()}`;
    const data = { id, date, person, tipo, start, end, note };

    const ok = await saveShiftAPI(data);
    if (ok) {
        closeModal();
        renderCal();
    }
});

// Eliminar turno
document.getElementById('cal-del-btn').addEventListener('click', async () => {
    const id = document.getElementById('cal-shift-id').value;
    if (!id || !confirm('¿Eliminar este turno?')) return;
    const ok = await deleteShiftAPI(id);
    if (ok) {
        closeModal();
        renderCal();
    }
});

// Cerrar modal
document.getElementById('cal-close-btn').addEventListener('click', closeModal);
document.getElementById('cal-cancel-btn').addEventListener('click', closeModal);
document.getElementById('cal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('cal-overlay')) closeModal();
});

// ── Navegación semanal ───────────────────────
document.getElementById('cal-prev').addEventListener('click', () => { calOffset--; renderCal(); });
document.getElementById('cal-next').addEventListener('click', () => { calOffset++; renderCal(); });
document.getElementById('cal-hoy').addEventListener('click', () => { calOffset = 0; renderCal(); });
document.getElementById('cal-new-shift').addEventListener('click', () => openModal(toISO(new Date()), null));

// ── Live preview de duración en el modal ─────
function updateDurPreview() {
    const s = document.getElementById('cal-shift-start').value;
    const e = document.getElementById('cal-shift-end').value;
    const m = minutesBetween(s, e);
    const preview = document.getElementById('cal-dur-preview');
    preview.textContent = m > 0 ? `⏱ Duración: ${fmtMins(m)}` : '';
}
document.getElementById('cal-shift-start').addEventListener('change', updateDurPreview);
document.getElementById('cal-shift-end').addEventListener('change', updateDurPreview);

