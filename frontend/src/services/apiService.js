import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const chatService = {
    sendMessage: async (mensaje, sessionId, userId, historial = []) => {
        const response = await api.post('/chat', { mensaje, historial, session_id: sessionId, usuario_id: userId });
        return response.data;
    }
};

export const transcribeService = {
    transcribeAudio: async (base64Audio) => {
        const response = await api.post('/transcribe', { audio: base64Audio });
        return response.data;
    }
};

export const pronunciationService = {
    analyze: async (base64Audio, palabra) => {
        const response = await api.post('/analyze-pronunciation', { audio: base64Audio, palabra });
        return response.data;
    }
};

export const progressService = {
    register: async () => {
        const response = await api.post('/progress/register');
        return response.data;
    },
    getStats: async (userId) => {
        const response = await api.get(`/progress/stats?userId=${userId}`);
        return response.data;
    },
    saveSession: async (sessionData) => {
        const response = await api.post('/progress/save-session', sessionData);
        return response.data;
    }
};
