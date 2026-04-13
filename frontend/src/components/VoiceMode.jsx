import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/apiService';
import { useStore } from '../store/useStore';
import { User, Volume2, AlertTriangle, Mic, Square, Trash2 } from 'lucide-react';

const VoiceMode = () => {
    const [mensajes, setMensajes] = useState([]); // [{role, texto, errores, sugerencias}]
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [statusMsg, setStatusMsg] = useState('Presiona el micrófono y habla en francés');
    const sessionId = useRef('sess_voice_' + Date.now());
    const recognitionRef = useRef(null);
    const bottomRef = useRef(null);
    const userId = useStore(state => state.userId);

    // Auto-scroll al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes, isLoading]);

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsRecording(true);
            setStatusMsg('🎙️ Escuchando... habla ahora en francés');
        };

        recognition.onresult = async (event) => {
            const texto = event.results[0][0].transcript;
            setIsRecording(false);
            setStatusMsg('Procesando tu mensaje...');
            await procesarMensaje(texto);
        };

        recognition.onerror = (event) => {
            setIsRecording(false);
            if (event.error === 'no-speech') {
                setStatusMsg('No te escuché. ¡Inténtalo de nuevo!');
            } else {
                setStatusMsg(`Error de micrófono: ${event.error}`);
            }
        };

        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopRecording = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    };

    const procesarMensaje = async (texto) => {
        // Añadir mensaje del usuario inmediatamente
        setMensajes(prev => [...prev, { role: 'user', texto }]);
        setIsLoading(true);

        try {
            // Construir historial para el contexto
            const historial = mensajes.map(m => ({
                role: m.role,
                content: m.texto
            }));

            const response = await chatService.sendMessage(
                texto,
                sessionId.current,
                userId,
                historial
            );

            // Añadir respuesta de la IA con correcciones y traducción
            setMensajes(prev => [...prev, {
                role: 'assistant',
                texto: response.respuesta,
                traduccion: response.traduccion || '',
                errores: response.errores || [],
                sugerencias: response.sugerencias || []
            }]);

            setStatusMsg('Presiona el micrófono para continuar la conversación');

            // TTS automático de la respuesta
            playTTS(response.respuesta);

        } catch (error) {
            console.error(error);
            setMensajes(prev => [...prev, {
                role: 'assistant',
                texto: 'No pude conectarme con el asistente. Verifica que el backend esté corriendo.',
                errores: [],
                sugerencias: []
            }]);
            setStatusMsg('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const playTTS = (text) => {
        window.speechSynthesis.cancel(); // Cancelar cualquier TTS previo
        const cleanText = text.replace(/[*_#~`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const clearConversation = () => {
        setMensajes([]);
        sessionId.current = 'sess_voice_' + Date.now();
        setStatusMsg('Presiona el micrófono y habla en francés');
        window.speechSynthesis.cancel();
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)]">

            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-white">
                        Chat de Voz
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Habla en francés — Gemma te corrige y responde
                    </p>
                </div>
                {mensajes.length > 0 && (
                    <button
                        onClick={clearConversation}
                        title="Limpiar conversación"
                        className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Limpiar</span>
                    </button>
                )}
            </div>

            {/* Chat thread — scrollable */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                {mensajes.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600 gap-3 pb-20">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Mic size={28} className="text-gray-400" />
                        </div>
                        <p className="text-sm max-w-xs">
                            Tu conversación aparecerá aquí. Presiona el micrófono para comenzar en francés.
                        </p>
                    </div>
                )}

                {mensajes.map((msg, idx) => (
                    <div key={idx}>
                        {msg.role === 'user' ? (
                            /* Mensaje del usuario */
                            <div className="flex gap-3 justify-end">
                                <div className="max-w-[80%] bg-francia-blue text-white p-4 rounded-2xl rounded-tr-none shadow">
                                    <p className="text-[15px] break-words leading-relaxed">{msg.texto}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                                </div>
                            </div>
                        ) : (
                            /* Respuesta de Gemma */
                            <div className="flex gap-3 justify-start">
                                <img src="/francoise.png" alt="François" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 border border-gray-200 dark:border-gray-700" />
                                <div className="max-w-[80%] space-y-2">
                                    {/* Burbuja de respuesta */}
                                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-2xl rounded-tl-none shadow">
                                        <p className="text-[15px] leading-relaxed">{msg.texto}</p>
                                        
                                        {msg.traduccion && (
                                            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-300 dark:border-gray-600 pl-2">
                                                "{msg.traduccion}"
                                            </p>
                                        )}

                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={() => playTTS(msg.texto)}
                                                title="Escuchar pronunciación"
                                                className="text-gray-400 hover:text-francia-blue dark:hover:text-francia-gold transition-colors p-1 rounded"
                                            >
                                                <Volume2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Correcciones gramaticales */}
                                    {msg.errores?.length > 0 && (
                                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 space-y-2">
                                            <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                                <AlertTriangle size={12} /> Correcciones
                                            </h4>
                                            {msg.errores.map((err, i) => (
                                                <div key={i} className="text-sm">
                                                    <span className="line-through text-red-400 mr-1">{err.palabra_incorrecta}</span>
                                                    <span className="text-green-600 dark:text-green-400 font-semibold mr-2">→ {err.correccion}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs">{err.explicacion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sugerencias */}
                                    {msg.sugerencias?.length > 0 && (
                                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3">
                                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">💡 Sugerencia</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{msg.sugerencias[0]}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                    <img src="/francoise.png" alt="François" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" />
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Barra de grabación fija abajo */}
            <div className="mt-4 bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-lg flex items-center gap-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                        isRecording
                            ? 'bg-red-500 shadow-red-500/40 animate-pulse'
                            : 'bg-francia-blue shadow-blue-500/30 hover:bg-blue-800'
                    }`}
                >
                    {isRecording ? <Square size={22} fill="white" className="text-white" /> : <Mic size={22} className="text-white" />}
                </button>

                <div className="flex-1">
                    <p className={`text-sm font-medium ${isRecording ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {statusMsg}
                    </p>
                    {mensajes.length > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                            {Math.floor(mensajes.length / 2)} intercambio{Math.floor(mensajes.length / 2) !== 1 ? 's' : ''} en esta sesión
                        </p>
                    )}
                </div>

                {isRecording && (
                    <div className="flex gap-1 items-center">
                        {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                            <div
                                key={i}
                                className="w-1 bg-red-400 rounded-full animate-pulse"
                                style={{
                                    height: `${h * 6}px`,
                                    animationDelay: `${i * 80}ms`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceMode;
