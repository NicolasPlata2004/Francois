import React from 'react';
import { Mic, Square, RefreshCw, Play } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const AudioRecorder = ({ onRecordingComplete }) => {
    const { isRecording, audioBlob, startRecording, stopRecording, resetRecording, getBase64 } = useAudioRecorder();

    const handleStop = () => {
        stopRecording();
    };

    const handleSend = async () => {
        const base64Data = await getBase64();
        if (base64Data && onRecordingComplete) {
            onRecordingComplete(base64Data, audioBlob);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-dark-bg rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            {isRecording && (
                <div className="waveform-container mb-4">
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar" style={{ animationDelay: '0.2s' }}></div>
                    <div className="waveform-bar" style={{ animationDelay: '0.4s' }}></div>
                    <div className="waveform-bar" style={{ animationDelay: '0.6s' }}></div>
                    <div className="waveform-bar" style={{ animationDelay: '0.8s' }}></div>
                </div>
            )}
            
            <div className="flex gap-4">
                {!isRecording && !audioBlob && (
                    <button 
                        onClick={startRecording}
                        className="flex items-center justify-center w-16 h-16 bg-francia-blue text-white rounded-full hover:bg-blue-800 transition shadow-lg"
                    >
                        <Mic size={28} />
                    </button>
                )}

                {isRecording && (
                    <button 
                        onClick={handleStop}
                        className="flex items-center justify-center w-16 h-16 bg-error text-white rounded-full hover:bg-red-700 transition shadow-lg animate-pulse"
                    >
                        <Square size={24} fill="currentColor" />
                    </button>
                )}

                {audioBlob && !isRecording && (
                    <>
                        <button 
                            onClick={resetRecording}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button 
                            onClick={() => {
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                audio.play();
                            }}
                            className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
                        >
                            <Play size={20} />
                        </button>
                        <button 
                            onClick={handleSend}
                            className="flex items-center gap-2 px-6 py-2 bg-francia-blue text-white rounded-full hover:bg-blue-800 transition shadow shadow-blue-500/30"
                        >
                            Enviar al Tutor
                        </button>
                    </>
                )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 font-medium">
                {isRecording ? "Grabando... Habla ahora" : "Presiona el botón para grabar"}
            </p>
        </div>
    );
};

export default AudioRecorder;
