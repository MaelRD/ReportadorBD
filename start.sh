#!/bin/bash
# ==============================================
# Script de inicio - Reporteador Soporte Odoo
# Requiere: Python 3.9+ y PostgreSQL corriendo
# ==============================================

# Crear entorno virtual si no existe
if [ ! -d ".venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv .venv
fi

echo "📦 Instalando dependencias..."
.venv/bin/pip install -r requirements.txt

echo "🚀 Iniciando servidor en http://0.0.0.0:3000"
.venv/bin/uvicorn server:app --host 0.0.0.0 --port 3000
