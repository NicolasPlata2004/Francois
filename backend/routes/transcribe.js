const express = require('express');
const router = express.Router();
const whisperService = require('../services/whisperService');

// POST /api/transcribe
router.post('/', async (req, res) => {
    const { audio } = req.body;
    
    if (!audio) {
        return res.status(400).json({ error: 'Audio en base64 requerido' });
    }

    try {
        const audioBuffer = Buffer.from(audio, 'base64');
        const transcripcion = await whisperService.transcribeAudio(audioBuffer);
        
        return res.json({
            texto: transcripcion.texto,
            confianza: transcripcion.confianza || 0.9,
            tiempo_ms: 1000 // Mock timing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error transcribing audio' });
    }
});

module.exports = router;
