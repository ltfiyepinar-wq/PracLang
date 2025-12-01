import React from 'react';
import { Scenario } from '../types';
import { ArrowLeft, CheckCircle2, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';

interface ScenarioSelectProps {
  scenario: Scenario;
  onBack: () => void;
  onStart: (level: 'A1-A2' | 'B1' | 'B2-C1') => void;
}

const ScenarioSelect: React.FC<ScenarioSelectProps> = ({ scenario, onBack, onStart }) => {
  
  const levels = [
    { 
        id: 'A1-A2', 
        label: 'Başlangıç', 
        desc: 'Yavaş ve basit cümleler.', 
        icon: SignalLow,
        color: 'text-green-400',
        bg: 'bg-green-400/10 border-green-400/20'
    },
    { 
        id: 'B1', 
        label: 'Orta Seviye', 
        desc: 'Doğal hız, günlük ifadeler.', 
        icon: SignalMedium,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/20'
    },
    { 
        id: 'B2-C1', 
        label: 'İleri Seviye', 
        desc: 'Hızlı, deyimler ve karmaşık yapı.', 
        icon: SignalHigh,
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/20'
    }
  ] as const;

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full">
        <img 
            src={scenario.image} 
            alt={scenario.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-app-bg"></div>
        
        <button 
            onClick={onBack} 
            className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 -mt-12 relative z-10 px-6 pb-6">
        <div className="bg-app-card border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-app-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                        {scenario.category === 'daily' ? 'Günlük Hayat' : 
                         scenario.category === 'travel' ? 'Seyahat' : 
                         scenario.category === 'work' ? 'İş & Kariyer' : 'Sosyal'}
                    </span>
                    <h1 className="text-2xl font-bold text-white mb-2">{scenario.title}</h1>
                </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {scenario.description} Bu senaryoda aşağıdaki görevleri tamamlamaya çalışacaksın.
            </p>

            <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Görevler</h3>
                {scenario.tasks.map((task, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <CheckCircle2 size={16} className="text-app-primary mr-3 flex-shrink-0" />
                        {task}
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Seviye Seç ve Başla</h3>
                {levels.map((lvl) => (
                    <button
                        key={lvl.id}
                        onClick={() => onStart(lvl.id)}
                        className={`w-full flex items-center p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-95 group ${lvl.bg} hover:bg-opacity-20`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-slate-900/50 ${lvl.color}`}>
                            <lvl.icon size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-lg ${lvl.color}`}>{lvl.id}</span>
                                <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Seç</span>
                            </div>
                            <p className="text-xs text-slate-400">{lvl.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelect;