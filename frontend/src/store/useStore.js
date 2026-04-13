import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      userId: null,
      setUserId: (id) => set({ userId: id }),

      stats: {
        total_sesiones: 0,
        horas_practica: 0,
        palabras_aprendidas: 0,
        precision_promedio: 0,
      },
      setStats: (stats) => set({ stats }),
    }),
    {
      name: 'french-tutor-storage',
    }
  )
);
