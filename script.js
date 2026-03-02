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
    if (window.innerWidth <= 768) closeMobileMenu();
});

navMinutas.addEventListener('click', (e) => {
    e.preventDefault();
    navMinutas.classList.add('active');
    navReports.classList.remove('active');
    viewMinutas.style.display = 'block';
    viewReports.style.display = 'none';
    document.getElementById('view-qr').style.display = 'none';
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
