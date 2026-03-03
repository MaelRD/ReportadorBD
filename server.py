# ==============================================
# Servidor FastAPI + PostgreSQL - Reporteador
# ==============================================

import os
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Reporteador - API de Horarios")

# ── Conexión a PostgreSQL ─────────────────────
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 5432)),
        dbname=os.getenv("DB_NAME", "reportes"),
        user=os.getenv("DB_USER", "reportes_user"),
        password=os.getenv("DB_PASSWORD", ""),
    )

# ── Inicializar tabla ─────────────────────────
def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS shifts (
                    id      VARCHAR(100) PRIMARY KEY,
                    date    DATE         NOT NULL,
                    person  VARCHAR(100) NOT NULL,
                    tipo    VARCHAR(50)  NOT NULL DEFAULT 'Presencial',
                    start   TIME,
                    "end"   TIME,
                    note    TEXT         DEFAULT ''
                );
            """)
            conn.commit()
        print("✅ Tabla 'shifts' lista en PostgreSQL")
    finally:
        conn.close()

@app.on_event("startup")
def on_startup():
    init_db()

# ── Modelo Pydantic ───────────────────────────
class Shift(BaseModel):
    id: str
    date: str           # YYYY-MM-DD
    person: str
    tipo: str = "Presencial"
    start: Optional[str] = None   # HH:MM
    end: Optional[str] = None     # HH:MM
    note: Optional[str] = ""

# ── Endpoints REST ────────────────────────────

# GET /api/shifts — Obtener todos los turnos
@app.get("/api/shifts")
def get_shifts():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT id, date::text, person, tipo,
                       start::text, "end"::text, note
                FROM shifts
                ORDER BY date ASC, start ASC NULLS LAST
            """)
            rows = cur.fetchall()
        # Normalizar formato HH:MM (PostgreSQL devuelve HH:MM:SS)
        result = []
        for row in rows:
            r = dict(row)
            if r.get("start"):
                r["start"] = r["start"][:5]
            if r.get("end"):
                r["end"] = r["end"][:5]
            result.append(r)
        return result
    finally:
        conn.close()

# POST /api/shifts — Crear o actualizar un turno (upsert)
@app.post("/api/shifts")
def upsert_shift(shift: Shift):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO shifts (id, date, person, tipo, start, "end", note)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    date   = EXCLUDED.date,
                    person = EXCLUDED.person,
                    tipo   = EXCLUDED.tipo,
                    start  = EXCLUDED.start,
                    "end"  = EXCLUDED."end",
                    note   = EXCLUDED.note
            """, (
                shift.id,
                shift.date,
                shift.person,
                shift.tipo,
                shift.start or None,
                shift.end or None,
                shift.note or "",
            ))
            conn.commit()
        return {"ok": True, "id": shift.id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# DELETE /api/shifts/{id} — Eliminar un turno
@app.delete("/api/shifts/{shift_id}")
def delete_shift(shift_id: str):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM shifts WHERE id = %s", (shift_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Turno no encontrado")
            conn.commit()
        return {"ok": True, "id": shift_id}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# ── Archivos estáticos del frontend ──────────
app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    # Servir index.html para todas las rutas que no sean /api/
    index_path = os.path.join(os.path.dirname(__file__), "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="index.html no encontrado")
