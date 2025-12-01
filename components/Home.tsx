
import React from 'react';
import { UserProfile, AppScreen, Scenario } from '../types';
import { Star, Play, ArrowRight } from 'lucide-react';

interface HomeProps {
  user: UserProfile;
  onNavigate: (screen: AppScreen, data?: any) => void;
  onSelectScenario: (scenario: Scenario) => void;
}

// Expanded Data with Images and Portrait Visuals
const SCENARIOS_DATA: Scenario[] = [
  // Daily
  { 
    id: '1', 
    category: 'daily', 
    title: 'Kahve Siparişi', 
    description: 'Baristaya özel isteklerini anlat.', 
    tasks: ['Kahve iste', 'Süt tipini seç', 'Ödeme yap'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    // Female Barista, black apron, friendly, looking at camera, holding coffee
    portraitVisual: 'https://images.unsplash.com/photo-1515159141380-5a3d46779836?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '2', 
    category: 'daily', 
    title: 'Adres Sorma', 
    description: 'Kayboldun, otele dönüş yolunu bul.', 
    tasks: ['Nerede olduğunu sor', 'Otobüs durağını öğren', 'Teşekkür et'],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80',
    // Man on street, looking at camera (portrait), helpful pedestrian vibe
    portraitVisual: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '3', 
    category: 'daily', 
    title: 'Market Alışverişi', 
    description: 'Sebze ve meyve reyonunda tazelik sor.', 
    tasks: ['Fiyat sor', 'Taze mi diye sor', 'Poşet iste'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    // Greengrocer / Market worker
    portraitVisual: 'https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=800&q=80'
  },
  // Travel
  { 
    id: '4', 
    category: 'travel', 
    title: 'Otel Check-in', 
    description: 'Resepsiyonda odaya giriş yap.', 
    tasks: ['Rezervasyonu söyle', 'Kahvaltı saatini sor', 'Wifi şifresini iste'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    // Receptionist, professional woman
    portraitVisual: 'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '5', 
    category: 'travel', 
    title: 'Havalimanı Kontrolü', 
    description: 'Pasaport kontrolünden geç.', 
    tasks: ['Pasaportu ver', 'Ziyaret amacını söyle', 'Kalış süresini belirt'],
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80',
    // Immigration officer, uniform style (neutral)
    portraitVisual: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '11', 
    category: 'travel', 
    title: 'Trafik Çevirmesi', 
    description: 'Polis kontrol noktasında durduruldun.', 
    tasks: ['Ehliyet ve ruhsatı ver', 'Nereye gittiğini açıkla', 'Bagajı açmayı kabul et'],
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=600&q=80',
    // Police officer, night context, serious
    portraitVisual: 'https://images.unsplash.com/photo-1544655681-435e02421319?auto=format&fit=crop&w=800&q=80'
  },
  // Work
  { 
    id: '6', 
    category: 'work', 
    title: 'İş Mülakatı', 
    description: 'Kendini tanıt ve deneyimlerinden bahset.', 
    tasks: ['Kendini tanıt', 'Güçlü yanını söyle', 'Maaş beklentisi sor'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    // HR Manager, suit, glasses
    portraitVisual: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '7', 
    category: 'work', 
    title: 'Toplantı Açılışı', 
    description: 'Yabancı ortaklarla toplantıyı başlat.', 
    tasks: ['Hoş geldiniz de', 'Gündemi özetle', 'Soruları al'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    // Colleague, professional business woman
    portraitVisual: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  // Social
  { 
    id: '9', 
    category: 'social', 
    title: 'Yeni Biriyle Tanışma', 
    description: 'Kafede yan masadaki kişiyle sohbet başlat.', 
    tasks: ['Oturmak için izin iste', 'Kitabı/Bilgisayarı hakkında soru sor', 'Kendini tanıt'],
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    // Casual person in cafe
    portraitVisual: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '10', 
    category: 'social', 
    title: 'Buluşma Planı Yapma', 
    description: 'Arkadaşınla hafta sonu planı yap.', 
    tasks: ['Müsaitlik durumunu sor', 'Sinema veya yemek öner', 'Saat ve yer belirle'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    // Friend, smiling man
    portraitVisual: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '8', 
    category: 'social', 
    title: 'Partide Tanışma', 
    description: 'Yeni insanlarla tanış.', 
    tasks: ['İsmini söyle', 'Ne iş yaptığını sor', 'İletişim bilgisi al'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    // Party goer, stylish woman
    portraitVisual: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
];

const CATEGORIES = [
  { id: 'daily', name: 'Günlük Hayat' },
  { id: 'travel', name: 'Seyahat' },
  { id: 'work', name: 'İş & Eğitim' },
  { id: 'social', name: 'Sosyal Hayat' },
];

const Home: React.FC<HomeProps> = ({ user, onNavigate, onSelectScenario }) => {
  return (
    <div className="min-h-screen bg-app-bg text-app-text pb-24 animate-in fade-in">
      {/* Header */}
      <header className="p-6 flex justify-between items-center sticky top-0 bg-app-bg/95 backdrop-blur z-20 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white">Merhaba, {user.name}</h1>
        </div>
        <div className="flex items-center space-x-3">
           {/* XP Indicator */}
           <div className="flex items-center bg-app-primary/10 px-3 py-1 rounded-full border border-app-primary/30">
             <Star className="w-4 h-4 text-app-primary mr-1" fill="currentColor" />
             <span className="text-sm font-bold text-app-primary">{user.xp} XP</span>
           </div>
           
           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-app-primary to-app-accent p-[2px]">
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
               alt="Avatar" 
               className="rounded-full bg-app-bg"
             />
           </div>
        </div>
      </header>

      <div className="space-y-8 pb-8">
        
        {/* Featured Hero Section */}
        <div className="px-6 mt-6">
            <div 
              className="relative h-64 rounded-3xl overflow-hidden shadow-2xl shadow-app-primary/20 cursor-pointer group"
              onClick={() => onSelectScenario(SCENARIOS_DATA[0])}
            >
              <img 
                src={SCENARIOS_DATA[0].image} 
                alt="Featured" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-app-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">ÖNE ÇIKAN</span>
                <h3 className="text-2xl font-bold text-white mb-1">{SCENARIOS_DATA[0].title}</h3>
                <p className="text-slate-300 text-sm line-clamp-2">{SCENARIOS_DATA[0].description}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur p-3 rounded-full border border-white/20">
                <Play className="text-white fill-white" size={20} />
              </div>
            </div>
        </div>

        {/* Categories (Netflix Style) */}
        {CATEGORIES.map((category) => {
          const categoryScenarios = SCENARIOS_DATA.filter(s => s.category === category.id);
          
          return (
            <div key={category.id} className="space-y-4">
              <div className="px-6 flex justify-between items-end">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <span className="text-xs text-app-primary font-bold flex items-center cursor-pointer hover:text-white transition-colors">
                  Tümü <ArrowRight size={12} className="ml-1" />
                </span>
              </div>
              
              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto px-6 space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {categoryScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    onClick={() => onSelectScenario(scenario)}
                    className="flex-shrink-0 w-40 snap-center group cursor-pointer"
                  >
                    <div className="relative w-40 h-56 rounded-2xl overflow-hidden mb-3 shadow-lg border border-slate-800">
                      <img 
                        src={scenario.image} 
                        alt={scenario.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-3 left-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/20 mb-2">
                           <Play size={12} className="text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight group-hover:text-app-primary transition-colors">{scenario.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{scenario.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Home;
