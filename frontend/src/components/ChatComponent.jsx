import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, User, AlertTriangle, Lightbulb } from 'lucide-react';
import { chatService } from '../services/apiService';
import { useStore } from '../store/useStore';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const userId = useStore(state => state.userId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { sender: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const contextMsg = messages.map(m => m.content).slice(-4); // Últimos mensajes para contexto
            const response = await chatService.sendMessage(userMsg.content, 'sess_' + Date.now(), userId, contextMsg);
            
            const iaMsg = { 
                sender: 'ia', 
                content: response.respuesta,
                traduccion: response.traduccion || '',
                errores: response.errores || [],
                sugerencias: response.sugerencias || []
            };
            setMessages(prev => [...prev, iaMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { 
                sender: 'system', 
                content: 'Grave erreur de connexion au serveur.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const playTextToSpeech = (text) => {
        const cleanText = text.replace(/[*_#~`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-dark-bg shadow-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                        <img src="/francoise.png" alt="François" className="w-24 h-24 rounded-full object-cover border-4 border-francia-blue/20 shadow-lg" />
                        <div className="text-center">
                            <h3 className="text-xl font-display font-bold text-gray-700 dark:text-gray-200">Bonjour ! Je suis François 🇫🇷</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tu profesora de francés personal.<br/>Escríbeme en francés y conversemos.</p>
                        </div>
                    </div>
                )}
                
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== 'user' && (
                            <img src="/francoise.png" alt="François" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 border border-gray-200 dark:border-gray-700" />
                        )}
                        
                        <div className={`max-w-[75%] rounded-2xl p-4 ${
                            msg.sender === 'user' 
                            ? 'bg-francia-blue text-white rounded-tr-none' 
                            : msg.sender === 'system'
                                ? 'bg-red-50 text-red-500 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-tl-none'
                        }`}>
                            <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                            
                            {msg.sender === 'ia' && msg.traduccion && (
                                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-300 dark:border-gray-600 pl-2">
                                    "{msg.traduccion}"
                                </p>
                            )}
                            
                            {msg.sender === 'ia' && (
                                <div className="mt-3 flex items-center justify-end">
                                    <button onClick={() => playTextToSpeech(msg.content)} className="text-francia-blue hover:text-blue-800 dark:text-francia-gold dark:hover:text-yellow-400 p-1 transition-colors">
                                        <Volume2 size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Mostrar errores del usuario si el tutor los detectó en este turno */}
                            {msg.errores?.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <h4 className="flex items-center gap-1 text-sm font-semibold text-error mb-2">
                                        <AlertTriangle size={14} /> Correcciones:
                                    </h4>
                                    {msg.errores.map((err, i) => (
                                        <div key={i} className="bg-red-50 dark:bg-red-900/10 rounded-lg p-2 text-sm">
                                            <span className="line-through text-error opacity-70 mr-2">{err.palabra_incorrecta}</span>
                                            <span className="font-semibold text-success">{err.correccion}</span>
                                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{err.explicacion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.sugerencias?.length > 0 && (
                                <div className="mt-2 text-sm text-francia-gold dark:text-yellow-500 flex gap-2 items-start bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg">
                                    <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-xs uppercase block mb-1">Mejor opción:</span>
                                        {msg.sugerencias.map((s, i) => <p key={i}>"{s}"</p>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {msg.sender === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <img src="/francoise.png" alt="François" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" />
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-gray-800">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Écris quelque chose en français..."
                        className="flex-1 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-francia-blue text-sm text-gray-800 dark:text-gray-100 transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-francia-blue hover:bg-blue-800 disabled:opacity-50 text-white rounded-full transition-colors"
                    >
                        <Send size={20} className="ml-1" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
