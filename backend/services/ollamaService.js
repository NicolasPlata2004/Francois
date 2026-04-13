const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'gemma3:4b'; // Or 'mistral' 

/**
 * Llama a la API local de Ollama para generar una respuesta
 * @param {string} prompt El texto de entrada para el LLM
 * @param {string} systemPrompt Prompt del sistema (comportamiento)
 * @returns {Promise<string>} La respuesta del modelo
 */
const SYSTEM_PROMPT = `Tu eres François, una profesora de francés nativa de París, carismática, paciente y apasionada por enseñar su idioma. 
Tienes un carácter cálido y ligeramente juguetón: a veces usas expresiones francesas coloquiales o añades un toque de humor parisino.
SIEMPRE respondes en francés, de forma natural y conversacional. 
Si el usuario comete un error evidente, lo corriges con sutileza y afecto, nunca con dureza.
Tu nombre es François y eres mujer.`;

async function generateResponse(prompt, systemPrompt = SYSTEM_PROMPT) {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            system: systemPrompt,
            prompt: prompt,
            stream: false
        });
        
        return response.data.response;
    } catch (error) {
        console.error("Error comunicando con Ollama:", error.message);
        return "_Je suis désolé, je n'ai pas pu me connecter à mon cerveau d'intelligence artificielle (Ollama). S'il vous plaît, allumez-le !_ [Error: Ollama desconectado u offline en localhost:11434]";
    }
}

module.exports = {
    generateResponse
};
