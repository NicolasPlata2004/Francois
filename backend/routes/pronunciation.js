const express = require('express');
const router = express.Router();
const voskService = require('../services/voskService');
const ollamaService = require('../services/ollamaService');

// POST /api/analyze-pronunciation
router.post('/', async (req, res) => {
    const { audio, palabra, userId } = req.body;
    
    if (!audio || !palabra) {
        return res.status(400).json({ error: 'Audio en base64 y palabra son requeridos' });
    }

    try {
        // Convert base64 to buffer
        const audioBuffer = Buffer.from(audio, 'base64');
        
        // 1. Analyze with Vosk
        const analysis = await voskService.analyzeAudio(audioBuffer, palabra);
        
        // 2. Ask Ollama for an explanation
        const prompt = `El usuario intentó pronunciar la palabra o frase en francés "${palabra}". 
El sistema evaluó su pronunciación con un puntaje de ${analysis.score}/100.
Fonemas u observaciones problemáticas: ${analysis.fonemas_incorrectos.join(', ') || 'Ninguna grave'}.
Proporciona un feedback específico en 1 o 2 oraciones para que el usuario mejore. Sé directo y útil, en español.`;

        const feedbackOllama = await ollamaService.generateResponse(prompt, "Eres un tutor de pronunciación francesa experto.");

        return res.json({
            score: analysis.score,
            fonemas: analysis.fonemas_incorrectos,
            feedback: feedbackOllama
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error analyzing pronunciation' });
    }
});

module.exports = router;
