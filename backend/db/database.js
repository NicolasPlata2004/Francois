const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'french-tutor.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected!');
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id TEXT PRIMARY KEY,
                nombre TEXT,
                nivel TEXT CHECK(nivel IN ('A1','A2','B1','B2')),
                idioma_nativo TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS sesiones (
                id TEXT PRIMARY KEY,
                usuario_id TEXT,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                modo TEXT CHECK(modo IN ('chat','voz','pronunciacion')),
                duracion_segundos INTEGER,
                errores_detectados INTEGER,
                precision_pronunciacion FLOAT,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS mensajes_chat (
                id TEXT PRIMARY KEY,
                sesion_id TEXT,
                usuario_id TEXT,
                mensaje_usuario TEXT,
                respuesta_ia TEXT,
                errores_json TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(sesion_id) REFERENCES sesiones(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS palabras_favoritas (
                id TEXT PRIMARY KEY,
                usuario_id TEXT,
                palabra TEXT,
                fecha_agregada DATETIME DEFAULT CURRENT_TIMESTAMP,
                intentos INTEGER DEFAULT 0,
                precision_promedio FLOAT DEFAULT 0,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS estadisticas (
                id TEXT PRIMARY KEY,
                usuario_id TEXT,
                total_sesiones INTEGER DEFAULT 0,
                total_horas FLOAT DEFAULT 0,
                palabras_aprendidas INTEGER DEFAULT 0,
                precision_promedio FLOAT DEFAULT 0,
                errores_comunes_json TEXT,
                ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            )
        `);
    }
});

module.exports = db;
