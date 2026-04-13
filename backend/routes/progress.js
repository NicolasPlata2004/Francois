const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// GET /api/progress/stats
router.get('/stats', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId es requerido' });

    db.get(`SELECT * FROM estadisticas WHERE usuario_id = ?`, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.json({ total_sesiones: 0, total_horas: 0, palabras_aprendidas: 0, precision_promedio: 0 });
        
        row.errores_comunes = row.errores_comunes_json ? JSON.parse(row.errores_comunes_json) : [];
        res.json(row);
    });
});

// POST /api/progress/save-session
router.post('/save-session', (req, res) => {
    const { modo, duracion, errores, precision, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId requerido' });
    }

    db.run(`INSERT INTO sesiones (id, usuario_id, modo, duracion_segundos, errores_detectados, precision_pronunciacion) 
            VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), userId, modo, duracion, errores, precision],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Actualizar estadísticas globales (simplificado)
            db.run(`UPDATE estadisticas 
                    SET total_sesiones = total_sesiones + 1,
                        total_horas = total_horas + (? / 3600.0)
                    WHERE usuario_id = ?`, [duracion, userId]);
                    
            res.json({ ok: true, session_id: this.lastID });
        }
    );
});

// Registrar un nuevo usuario (helper inicial)
router.post('/register', (req, res) => {
    const id = uuidv4();
    db.run(`INSERT INTO usuarios (id, nombre, nivel, idioma_nativo) VALUES (?, 'Usuario Anónimo', 'A1', 'Español')`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run(`INSERT INTO estadisticas (id, usuario_id) VALUES (?, ?)`, [uuidv4(), id]);
        
        res.json({ userId: id });
    });
});

module.exports = router;
