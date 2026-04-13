import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { progressService } from '../services/apiService';
import { Trophy, Clock, Target, SpellCheck } from 'lucide-react';

const ProgressDashboard = () => {
    const { userId, stats } = useStore();
    const [mockData, setMockData] = useState([
        { date: 'Lun', score: 65 },
        { date: 'Mar', score: 70 },
        { date: 'Mié', score: 68 },
        { date: 'Jue', score: 75 },
        { date: 'Vie', score: 82 },
        { date: 'Sáb', score: 85 },
        { date: 'Dom', score: 88 }
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-white">Estadísticas de Aprendizaje</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-blue-100 text-francia-blue rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Sesiones</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total_sesiones}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-yellow-100 text-francia-gold rounded-lg dark:bg-yellow-900/30 dark:text-yellow-500">
                        <Target size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Precisión Promedio</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.precision_promedio}%</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-green-100 text-success rounded-lg dark:bg-green-900/30">
                        <SpellCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Palabras Nuevas</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.palabras_aprendidas}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Nivel CEFR</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">A1</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Precisión de Pronunciación (Últimos 7 días)</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer>
                        <LineChart data={mockData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis domain={[0, 100]} stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }} />
                            <Line type="monotone" dataKey="score" stroke="#002395" strokeWidth={3} dot={{ r: 5, fill: '#FFB81C' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboard;
