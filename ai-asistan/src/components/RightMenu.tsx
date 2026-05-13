import {
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RightMenu() {
    const navigate = useNavigate();
    return (
        <div className="w-[25%] bg-slate-50/50 border-l border-slate-100 p-6 flex flex-col gap-8">

            <div>
                <h4 className="text-xs font-bold text-slate-400 tracking-widest mb-4">Çıkış</h4>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <LogOut className="text-slate-300" size={24} />
                    </div>
                    <button className="w-full py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 transition"
                        onClick={() => navigate('/login')}>
                        Çıkış Yap
                    </button>
                </div>
            </div>



        </div>

    );
}

export default RightMenu;