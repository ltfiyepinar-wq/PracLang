
import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, Home } from 'lucide-react';

interface ResultProps {
  result: AnalysisResult;
  onHome: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onHome }) => {
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 60) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text p-6 flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      
      <div className="text-center mb-8 pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">Pratik Tamamlandı!</h1>
        <p className="text-slate-400 text-sm">İşte performans analizin</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center shadow-2xl shadow-slate-900 ${getScoreColor(result.score)}`}>
            <div className="text-center">
                <span className="text-4xl font-bold block">{result.score}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Puan</span>
            </div>
        </div>
      </div>

      <div className="bg-app-card border border-slate-700 rounded-3xl p-6 mb-6 shadow-xl">
        <h2 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center">
            <CheckCircle2 size={16} className="mr-2 text-app-primary" /> 
            Yapay Zeka Yorumu
        </h2>
        <p className="text-slate-300 leading-relaxed text-sm">
            {result.feedback}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase mb-4 pl-1">Düzeltmeler & İpuçları</h2>
        
        {result.corrections.length === 0 ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                <p className="text-green-400 font-bold mb-1">Harika İş!</p>
                <p className="text-xs text-green-300">Konuşmanda önemli bir hata bulunamadı.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {result.corrections.map((item, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                        <div className="flex items-start mb-2">
                            <AlertTriangle size={16} className="text-red-400 mt-1 mr-2 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Senin Cümlen</p>
                                <p className="text-red-300 text-sm line-through decoration-red-400/50">{item.original}</p>
                            </div>
                        </div>
                        <div className="flex justify-center my-2">
                            <ArrowRight size={16} className="text-slate-600 rotate-90" />
                        </div>
                        <div className="flex items-start">
                            <CheckCircle2 size={16} className="text-green-400 mt-1 mr-2 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Doğrusu / Daha İyisi</p>
                                <p className="text-green-300 text-sm font-medium">{item.correction}</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400 italic">
                            💡 {item.reason}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <button 
        onClick={onHome}
        className="w-full bg-app-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-app-primary/40 hover:scale-[1.02] transition-transform flex items-center justify-center"
      >
        <Home size={20} className="mr-2" />
        Anasayfaya Dön
      </button>

    </div>
  );
};

export default Result;
