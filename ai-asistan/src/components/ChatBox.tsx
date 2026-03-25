import { Brain, Bell, Phone, Smile, Leaf, Zap, Frown, Mic, Send } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface ChatBoxProps {
    mesajlar: { gonderen: string; mesaj: string }[];
    setMesajlar: React.Dispatch<React.SetStateAction<{ gonderen: string; mesaj: string }[]>>;
    anlikDuygu: string;
    yukleniyor: boolean;
    setYukleniyor: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBox({ mesajlar, setMesajlar, anlikDuygu, yukleniyor, setYukleniyor }: ChatBoxProps) {
    const [mesaj, setMesaj] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSeansBitir = async () => {
        if (mesajlar.length === 0) return;
        setYukleniyor(true);
        try {
            const response = await axios.post('http://localhost:3000/api/chat/save-session', {
                mesajlar
            });
            if (response.status === 200) {
                alert("Seans başarıyla kaydedildi!");
                setMesajlar([]); // Sohbeti temizle
            }
        } catch (error) {
            alert("Seans kaydedilirken hata oluştu.");
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [mesajlar, yukleniyor]);

    const handleGonder = async () => {
        if (!mesaj.trim()) return;

        const yeniMesaj = { gonderen: 'kullanici', mesaj };
        setMesajlar((prev) => [...prev, yeniMesaj]);
        setMesaj('');
        setYukleniyor(true);

        try {
            const response = await axios.post('http://localhost:3000/api/chat/send', {
                kullaniciMesaji: yeniMesaj.mesaj,
                anlikDuygu
            });
            
            if (response.status === 200) {
                setMesajlar((prev) => [...prev, { gonderen: 'ai', mesaj: response.data.mesaj }]);
            } else {
                setMesajlar((prev) => [...prev, { gonderen: 'ai', mesaj: response.data.hata || 'Bir hata oluştu.' }]);
            }
        } catch (error: any) {
            const hataMesaji = error.response?.data?.hata || 'Sunucuya bağlanılamadı.';
            setMesajlar((prev) => [...prev, { gonderen: 'ai', mesaj: hataMesaji }]);
        } finally {
            setYukleniyor(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleGonder();
        }
    };

    return (
        <div className="w-[55%] flex flex-col h-full relative bg-white">
            {/* Üst Header */}
            <div className="flex justify-between items-center p-6">
                <span className="text-slate-400 italic text-sm">Her zaman yanındayız.</span>
                <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-slate-600 transition">
                        <Bell size={20} />
                    </button>
                    <button className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-green-100 transition">
                        <Phone size={16} />
                        Destek Hattı
                    </button>
                    <button
                        onClick={handleSeansBitir}
                        disabled={yukleniyor || mesajlar.length === 0}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-red-100 transition disabled:opacity-50"
                    >
                        Seansı Bitir
                    </button>
                </div>
            </div>

            {/* Mesajlaşma İçeriği */}
            <div className="flex-1 overflow-y-auto px-10 pb-32">
                {mesajlar.length === 0 && (
                    <>
                        {/* AI Mesaj Balonu */}
                        <div className="flex items-start gap-3 mt-4">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                                <Brain size={20} />
                            </div>
                            <div>
                                <div className="bg-green-50/80 p-5 rounded-2xl rounded-tl-sm text-slate-700 text-sm max-w-lg leading-relaxed shadow-sm border border-green-100/50">
                                    Merhaba, bugün nasılsınız? Kendinizi nasıl hissettiğinizi paylaşmak isterseniz sizi dinlemek için buradayım.
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Zihin Dostu AI</div>
                            </div>
                        </div>

                        {/* Duygu Durumu Seçici */}
                        <div className="mt-16 flex flex-col items-center">
                            <h3 className="text-slate-600 font-medium mb-6">Bugün nasıl hissediyorsunuz?</h3>
                            <div className="flex gap-4">
                                <button className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl w-24 hover:border-yellow-400 hover:shadow-md transition bg-white gap-2">
                                    <Smile className="text-yellow-500" size={28} />
                                    <span className="text-xs font-semibold text-slate-500">MUTLU</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl w-24 hover:border-blue-400 hover:shadow-md transition bg-white gap-2">
                                    <Leaf className="text-blue-500" size={28} />
                                    <span className="text-xs font-semibold text-slate-500">SAKİN</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl w-24 hover:border-orange-400 hover:shadow-md transition bg-white gap-2">
                                    <Zap className="text-orange-500" size={28} />
                                    <span className="text-xs font-semibold text-slate-500">ENDİŞELİ</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-2xl w-24 hover:border-purple-400 hover:shadow-md transition bg-white gap-2">
                                    <Frown className="text-purple-500" size={28} />
                                    <span className="text-xs font-semibold text-slate-500">ÜZGÜN</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {mesajlar.map((m, idx) => (
                    m.gonderen === 'ai' ? (
                        <div key={idx} className="flex items-start gap-3 mt-4">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                                <Brain size={20} />
                            </div>
                            <div>
                                <div className="bg-green-50/80 p-5 rounded-2xl rounded-tl-sm text-slate-700 text-sm max-w-lg leading-relaxed shadow-sm border border-green-100/50">
                                    {m.mesaj}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Zihin Dostu AI</div>
                            </div>
                        </div>
                    ) : (
                        <div key={idx} className="flex items-start justify-end gap-3 mt-4">
                            <div>
                                <div className="bg-slate-100 border border-slate-200 p-5 rounded-2xl rounded-tr-sm text-slate-700 text-sm max-w-lg leading-relaxed shadow-sm">
                                    {m.mesaj}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 text-right font-medium uppercase tracking-wider">Sen</div>
                            </div>
                        </div>
                    )
                ))}

                {yukleniyor && (
                    <div className="flex items-start gap-3 mt-4">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                            <Brain size={20} />
                        </div>
                        <div className="bg-green-50/80 p-5 rounded-2xl rounded-tl-sm text-slate-500 text-sm italic animate-pulse">
                            Düşünüyor...
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Mesaj Yazma Input Alanı (Sabit Alt) */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-10">
                <div className="relative flex items-center shadow-lg rounded-full bg-white border border-slate-100 p-2">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700 placeholder:text-slate-400"
                        placeholder="Bir şeyler yazın..."
                        value={mesaj}
                        onChange={(e) => setMesaj(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <Mic size={20} />
                    </button>
                    <button 
                        onClick={handleGonder}
                        disabled={yukleniyor}
                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md ml-1 disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-3 text-[10px] text-slate-400">
                    Zihin Dostu bir AI asistanıdır ve tıbbi teşhis koymaz.
                </div>
            </div>
        </div>
    );
}

export default ChatBox;