const { pipeline } = require('@xenova/transformers');

let transcriber = null;

// Inicializa el modelo en background
(async () => {
    try {
        console.log("Cargando modelo Whisper-tiny... esto puede tardar la primera vez");
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
        console.log("Modelo Whisper-tiny cargado");
    } catch (e) {
        console.error("Error cargando Whisper", e);
    }
})();

/**
 * Transcribe un buffer de audio usando Whisper Local
 */
async function transcribeAudio(audioBuffer) {
    if (!transcriber) {
        throw new Error("El modelo Whisper aún no está listo o falló al cargar.");
    }
    
    // Convert Buffer into float32 array as required by the pipeline
    // Assuming 16kHz audio buffer was sent (simplified for this prototype)
    const float32Array = new Float32Array(audioBuffer.buffer);
    
    try {
        const result = await transcriber(float32Array, { language: 'french', task: 'transcribe' });
        return {
            texto: result.text.trim(),
            confianza: 0.9 // Transformers JS doesn't natively expose confidence for pipeline easily
        };
    } catch (e) {
        console.error("Error en transcripción:", e);
        throw e;
    }
}

module.exports = { transcribeAudio };
