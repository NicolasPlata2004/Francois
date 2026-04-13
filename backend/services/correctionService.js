const ollamaService = require('./ollamaService');

/**
 * Analiza una frase en francés para encontrar errores gramaticales o de vocabulario
 * utilizando el modelo local.
 */
async function analyzeErrors(texto) {
    const promptDefinicion = `
Analiza la siguiente frase en francés: "${texto}"
Tu tarea es identificar cualquier error gramatical, ortográfico, de conjugación o de selección de vocabulario.
Si no hay errores, responde exáctamente con: {"errores": [], "sugerencias": []}
Si hay errores, responde estrictamente en formato JSON válido de este modo:
{
    "errores": [
        {
            "palabra_incorrecta": "palabra",
            "correccion": "palabra correcta",
            "explicacion": "Breve explicación en español del error"
        }
    ],
    "sugerencias": [
        "Sugerencia de forma más natural de decirlo"
    ]
}
No devuelvas ningún otro texto, solo el JSON.
`;

    try {
        const respuesta = await ollamaService.generateResponse(
            promptDefinicion, 
            "Eres un analizador de sintaxis estricto que responde únicamente en formato JSON."
        );
        
        // Limpiar la respuesta en caso de que el modelo haya añadido formato markdown (```json ... ```)
        const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return { errores: [], sugerencias: [] };
    } catch (e) {
        console.error("Error en correctionService:", e.message);
        return { errores: [], sugerencias: [] };
    }
}

module.exports = {
    analyzeErrors
};
