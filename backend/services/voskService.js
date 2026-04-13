let vosk;
try {
    vosk = require('vosk');
} catch (e) {
    console.warn("Vosk library not installed. Continuing with mock.");
}
const fs = require('fs');
const path = require('path');

// Ensure you have a model downloaded to the models directory
// You can download vosk-model-fr-0.6-small and place it in backend/models/vosk-model-fr
const MODEL_PATH = path.join(__dirname, '..', 'models', 'vosk-model-fr');

let model;
try {
    if (fs.existsSync(MODEL_PATH)) {
        vosk.setLogLevel(0);
        model = new vosk.Model(MODEL_PATH);
    } else {
        console.warn(`WARNING: Vosk model not found at ${MODEL_PATH}. Pronunciation analysis will return dummy data.`);
    }
} catch (e) {
    console.error("Failed to load Vosk model", e);
}

/**
 * Analiza la pronunciación de un audio comparándolo con una palabra esperada.
 */
async function analyzeAudio(audioBuffer, palabraEsperada) {
    if (!model) {
        // Return dummy response if model is missing
        return {
            score: Math.floor(Math.random() * 20) + 70, // 70-90
            fonemas_incorrectos: ["r", "e"],
            feedback: "Asegúrate de vibrar la 'r' desde la garganta (r francesa)."
        };
    }

    // Initialize Recognizer
    const rec = new vosk.Recognizer({model: model, sampleRate: 16000});
    rec.acceptWaveform(audioBuffer);
    
    // Vosk doesn't natively return a strict "pronunciation score" directly in the JS API without custom acoustic models scoring. 
    // Usually, you compare the recognized confident words/phonemes with the expected text.
    // For this prototype, we'll extract the recognized text and provide a naive score based on string distance/confidence.
    
    const result = rec.result();
    const recognizedText = result.text || "";
    
    // Naive scoring
    let score = 0;
    if (recognizedText.toLowerCase().includes(palabraEsperada.toLowerCase())) {
        score = 95;
    } else {
        score = 75; // Partial logic
    }
    
    rec.free();

    return {
        score,
        fonemas_incorrectos: score < 90 ? ["reconocimiento_parcial"] : [],
        feedback: `Se reconoció: "${recognizedText}". ${score < 90 ? 'Intenta articular mejor las vocales.' : '¡Excelente pronunciación!'}`
    };
}

module.exports = {
    analyzeAudio
};
