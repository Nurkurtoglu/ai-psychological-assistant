//import React from 'react'
import {
    Brain, MessageSquare, BarChart2, Wind, BookOpen, Settings,
} from 'lucide-react';

function LeftMenu() {
    // <div>{/* 1. BÖLME: SOL PANEL (Menü) */}
    //        {/*w-[20%] border-r border-slate-200 flex flex-col justify-between p-4  */}

    return (

        <div className="w-[20%] h-full border-r border-slate-200 flex flex-col justify-between p-4">
            <div>
                {/* Logo Kısmı */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Zihin Dostu</h1>
                        <span className="text-xs text-green-500 font-medium tracking-wide">AI DANIŞMAN</span>
                    </div>
                </div>

                {/* Menü Linkleri */}
                <div className="text-xs text-slate-400 font-semibold mb-3 px-2">ANA MENÜ</div>
                <nav className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-2xl font-medium w-full shadow-sm hover:bg-green-600 transition">
                        <MessageSquare size={18} />
                        Chat History
                    </button>
                    <button className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-2xl font-medium w-full transition">
                        <BarChart2 size={18} />
                        Duygu Takpçim
                    </button>
                    <button className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-2xl font-medium w-full transition">
                        <Wind size={18} />
                        Nefes Egzersizi
                    </button>
                    <button className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-2xl font-medium w-full transition">
                        <BookOpen size={18} />
                        Kaynaklar
                    </button>
                </nav>

                <div className="text-xs text-slate-400 font-semibold mt-6 mb-3 px-2">HESAP</div>
                <button className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-2xl font-medium w-full transition">
                    <Settings size={18} />
                    Ayarlar
                </button>
            </div>

            {/* Kullanıcı Profili (Alt Kısım) */}
            {/* <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-orange-300"></div>
                    <div>
                        <div className="text-sm font-bold">Kullanıcı</div>
                        <div className="text-xs text-slate-500">Premium Üye</div>
                    </div>
                </div> */}
        </div>
    )
}

export default LeftMenu