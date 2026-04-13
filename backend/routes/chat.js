const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const ollamaService = require('../services/ollamaService');
const correctionService = require('../services/correctionService');

// POST /api/chat
router.post('/', async (req, res) => {
    const { mensaje, historial, session_id, usuario_id } = req.body;
    
    if (!mensaje) {
        return res.status(400).json({ error: 'Mensaje requerido' });
    }

    try {
        // 1. Construir prompt con historial de conversación
        let contexto = '';
        if (historial && historial.length > 0) {
            contexto = historial.map(m => 
                m.role === 'user' ? `Usuario: ${m.content}` : `Asistente: ${m.content}`
            ).join('\n');
            contexto = `Historial de la conversación:\n${contexto}\n\n`;
        }

        const prompt = `${contexto}El usuario ahora dice: "${mensaje}". 
Asume tu rol y responde de forma natural. 
INSTRUCCIÓN ESTRICTA: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido con este formato exacto, sin ningún texto antes ni después:
{
  "frances": "Tu respuesta conversacional 100% en francés",
  "espanol": "La traducción exacta de tu respuesta al español"
}`;
        
        const respuestaRaw = await ollamaService.generateResponse(prompt);
        let respuestaFrances = respuestaRaw;
        let traduccionEspanol = '';

        try {
            const jsonMatch = respuestaRaw.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.frances) respuestaFrances = parsed.frances;
                if (parsed.espanol) traduccionEspanol = parsed.espanol;
            }
        } catch (e) {
            console.warn('Fallo parseando JSON de respuesta, fallback a texto plano');
        }
        
        // 2. Aplicar correctionService para detectar errores gramaticales o de sintaxis
        const analisis = await correctionService.analyzeErrors(mensaje);
        
        // 3. Guardar en SQLite si tenemos ids
        if (session_id && usuario_id) {
            db.run(`INSERT INTO mensajes_chat (id, sesion_id, usuario_id, mensaje_usuario, respuesta_ia, errores_json) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                [uuidv4(), session_id, usuario_id, mensaje, respuestaFrances, JSON.stringify(analisis.errores)],
                (err) => {
                    if (err) console.error('Error guardando mensaje:', err);
                }
            );
        }

        return res.json({
            respuesta: respuestaFrances,
            traduccion: traduccionEspanol,
            errores: analisis.errores,
            sugerencias: analisis.sugerencias
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing chat' });
    }
});

module.exports = router;
