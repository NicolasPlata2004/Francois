import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import { pronunciationService } from '../services/apiService';
import { useStore } from '../store/useStore';
import { Ear, Play, CheckCircle2, XCircle } from 'lucide-react';

const PALABRAS_REFERENCIA = [
    "Bonjour",
    "Enchanté",
    "Croissant",
    "Rendez-vous",
    "Aujourd'hui",
    "Je voudrais"
];

const PronunciationMode = () => {
    const [palabraActual, setPalabraActual] = useState(PALABRAS_REFERENCIA[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const userId = useStore(state => state.userId);

    const nextWord = () => {
        const random = PALABRAS_REFERENCIA[Math.floor(Math.random() * PALABRAS_REFERENCIA.length)];
        setPalabraActual(random);
        setAnalysis(null);
    };

    const playReference = () => {
        const utterance = new SpeechSynthesisUtterance(palabraActual);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8; // Un poco más lento para escuchar claro
        window.speechSynthesis.speak(utterance);
    };

    const handleAudioComplete = async (base64Audio) => {
        setIsLoading(true);
        setAnalysis(null);

        try {
            const response = await pronunciationService.analyze(base64Audio, palabraActual);
            setAnalysis(response);
        } catch (error) {
            console.error(error);
            alert("No se pudo analizar la pronunciación con Vosk.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold font-display text-gray-800 dark:text-white flex items-center justify-center gap-3">
                    <Ear size={32} className="text-francia-gold" />
                    Análisis de Pronunciación
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Compara tu acento fonema por fonema usando la tecnología de Vosk.
                </p>
            </div>

            <div className="bg-white dark:bg-dark-bg p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-francia-blue"></div>
                
                <h3 className="uppercase text-xs font-bold text-gray-500 tracking-wider mb-2">Palabra a practicar:</h3>
                <p className="text-5xl font-display font-bold text-francia-blue dark:text-blue-400 mb-6 drop-shadow-sm">
                    {palabraActual}
                </p>

                <div className="flex justify-center gap-4 mb-8">
                    <button 
                        onClick={playReference}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium transition"
                    >
                        <Play size={20} className="text-francia-blue dark:text-francia-gold" />
                        Escuchar Nativo
                    </button>
                    <button 
                        onClick={nextWord}
                        className="px-6 py-3text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline text-sm"
                    >
                        Cambiar palabra
                    </button>
                </div>

                <AudioRecorder onRecordingComplete={handleAudioComplete} />
            </div>

            {isLoading && (
                <div className="text-center text-gray-500 animate-pulse bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    Procesando espectrogramas y analizando fonemas...
                </div>
            )}

            {analysis && (
                <div className="bg-white dark:bg-dark-bg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold dark:text-white">Resultado</h3>
                        <div className="text-right">
                            <span className="text-4xl font-display font-bold" style={{
                                color: analysis.score >= 90 ? '#27AE60' : analysis.score >= 70 ? '#FFB81C' : '#E74C3C'
                            }}>
                                {analysis.score}%
                            </span>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">de coincidencia</p>
                        </div>
                    </div>

                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full transition-all duration-1000" 
                            style={{ 
                                width: `${analysis.score}%`,
                                backgroundColor: analysis.score >= 90 ? '#27AE60' : analysis.score >= 70 ? '#FFB81C' : '#E74C3C'
                            }}
                        ></div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Feedback Específico</h4>
                        {analysis.fonemas?.length > 0 ? (
                            <div className="flex gap-2 items-center text-error mb-2 text-sm bg-red-50 dark:bg-red-900/10 p-2 rounded">
                                <XCircle size={16} /> 
                                Fonemas a mejorar: {analysis.fonemas.join(', ')}
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center text-success mb-2 text-sm bg-green-50 dark:bg-green-900/10 p-2 rounded">
                                <CheckCircle2 size={16} /> 
                                ¡Todos los fonemas se escucharon claros!
                            </div>
                        )}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-4 p-4 bg-gray-50 dark:bg-[#151515] rounded-xl">
                            {analysis.feedback}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PronunciationMode;
