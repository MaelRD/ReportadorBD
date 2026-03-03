# ==============================================
# Dockerfile - Reporteador Soporte Odoo
# ==============================================

# Imagen base Python slim para menor peso
FROM python:3.11-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias primero (cache eficiente)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Puerto expuesto
EXPOSE 3000

# Comando de inicio
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "3000"]
