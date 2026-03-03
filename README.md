# Reporteador - Soporte Odoo

Herramienta web para la estandarización y generación de reportes de entrega de turno en el equipo de Soporte Técnico Odoo.

## Características Principales

- **Interfaz Moderna**: Diseño Glassmorphism con tema oscuro.
- **Generación de PDF**: Convierte el reporte en un PDF profesional.
- **Gestión Dinámica de Tickets**: Agrega, edita y elimina tickets interactivamente.
- **Calendario de Turnos**: Registro y visualización de horarios con persistencia en PostgreSQL.
- **Módulo de Minutas**: Generación de minutas de reuniones con acuerdos.
- **Generador QR**: Crea códigos QR para texto, URL, email o teléfono.

---

## Instalación con Docker (Recomendado para VM)

### Requisitos Previos
- Docker y Docker Compose instalados en la VM

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd reportes
```

### 2. Configurar la contraseña
Edita el archivo `.env` y pon tu contraseña:
```
DB_PASSWORD=tu_password_seguro
```

### 3. Levantar todo con un solo comando
```bash
docker compose up -d
```
Esto descarga PostgreSQL, construye la imagen de la app y levanta ambos servicios.

### 4. Acceder a la aplicación
```
http://<IP-de-la-VM>:3000
```

### Comandos útiles
```bash
docker compose logs -f          # Ver logs en tiempo real
docker compose down             # Detener los contenedores
docker compose down -v          # Detener y borrar los datos
docker compose up -d --build    # Reconstruir tras cambios en el código
```

> Los datos de PostgreSQL persisten en un volumen Docker llamado `postgres_data`, por lo que sobreviven reinicios.

---

## Instalación sin Docker (Python directo en VM)

### Requisitos Previos
- Python 3.9+
- PostgreSQL 13+ corriendo y accesible
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd reportes
```

### 2. Configurar PostgreSQL
```sql
-- Como superusuario de PostgreSQL:
CREATE DATABASE reportes;
CREATE USER reportes_user WITH PASSWORD 'tu_password_aqui';
GRANT ALL PRIVILEGES ON DATABASE reportes TO reportes_user;
```

### 3. Configurar variables de entorno
```bash
cp .env .env.local   # opcional, edita .env directamente
```
Edita el archivo `.env` con tus credenciales de PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reportes
DB_USER=reportes_user
DB_PASSWORD=tu_password_aqui
PORT=3000
```

### 4. Iniciar el servidor
```bash
chmod +x start.sh
./start.sh
```
O manualmente:
```bash
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 3000
```

### 5. Acceder a la aplicación
Abre en el navegador: `http://<IP-de-la-VM>:3000`

---

## Uso sin servidor (modo local)

Si no tienes el servidor corriendo, abre `index.html` directamente en el navegador.
Los datos del calendario se guardarán en el `localStorage` del navegador como respaldo.

---

## Estructura del Proyecto

| Archivo           | Descripción                                      |
|-------------------|--------------------------------------------------|
| `index.html`      | Estructura principal de la aplicación            |
| `style.css`       | Estilos CSS con diseño Glassmorphism             |
| `script.js`       | Lógica del frontend, PDF, QR y calendario        |
| `server.py`       | Servidor FastAPI + conexión PostgreSQL           |
| `requirements.txt`| Dependencias Python                              |
| `.env`            | Configuración de conexión a la base de datos     |
| `start.sh`        | Script de inicio para la VM                      |
