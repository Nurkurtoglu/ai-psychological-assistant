import {
    Wind
} from 'lucide-react';

function RightMenu() {
    return (
        <div className="w-[25%] bg-slate-50/50 border-l border-slate-100 p-6 flex flex-col gap-8">

            {/* Günün Egzersizi Widget */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 tracking-widest mb-4">GÜNÜN EGZERSİZİ</h4>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="font-bold text-slate-700">Derin Nefes</div>
                            <div className="text-xs text-slate-500 mt-1">4-7-8 Tekniği ile rahatla</div>
                        </div>
                        <Wind className="text-slate-300" size={24} />
                    </div>
                    <button className="w-full py-2 bg-green-50 text-green-600 font-semibold text-sm rounded-xl hover:bg-green-100 transition">
                        Başlat
                    </button>
                </div>
            </div>

            {/* Mood Trendi Widget */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 tracking-widest mb-4">MOOD TRENDİ</h4>
                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100/50 shadow-sm flex flex-col items-center">
                    {/* Temsili Bar Grafik */}
                    <div className="flex items-end gap-2 h-20 mb-4">
                        <div className="w-3 bg-green-300 rounded-t-sm h-8"></div>
                        <div className="w-3 bg-green-400 rounded-t-sm h-12"></div>
                        <div className="w-3 bg-green-200 rounded-t-sm h-6"></div>
                        <div className="w-3 bg-green-500 rounded-t-sm h-16"></div>
                        <div className="w-3 bg-green-600 rounded-t-sm h-20"></div>
                        <div className="w-3 bg-green-400 rounded-t-sm h-10"></div>
                        <div className="w-3 bg-green-500 rounded-t-sm h-14"></div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Son 7 günde harika ilerledin!</div>
                </div>
            </div>

        </div>

    );
}

export default RightMenu;