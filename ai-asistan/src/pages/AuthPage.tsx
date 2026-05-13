import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const [adSoyad, setAdSoyad] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [hataMesaji, setHataMesaji] = useState('');

    // Sayfa yönlendirmesi için navigate fonksiyonunu tanımlıyoruz
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHataMesaji('');

        const url = isLogin
            ? 'http://localhost:3000/api/auth/login'
            : 'http://localhost:3000/api/auth/register';

        const body = isLogin
            ? { email, sifre }
            : { adSoyad, email, sifre };

        try {
            // Fetch yerine Axios kullanarak çok daha temiz bir istek atıyoruz
            const response = await axios.post(url, body);

            if (isLogin) {
                // GİRİŞ BAŞARILIYSA:
                // 1. Token'ı kaydet
                localStorage.setItem('token', response.data.token);
                // 2. React Router ile sayfayı yenilemeden '/chat' rotasına yönlendir
                navigate('/chat');
            } else {
                // KAYIT BAŞARILIYSA:
                alert('Kayıt başarılı! Lütfen giriş yapın.');
                setIsLogin(true); // Giriş formuna geç
                setSifre(''); // Güvenlik için şifre kutusunu temizle
            }
        } catch (error: any) {
            // Axios hataları yakalamada çok daha iyidir. Backend'den gelen hata mesajını doğrudan alırız.
            if (error.response && error.response.data && error.response.data.hata) {
                setHataMesaji(error.response.data.hata);
            } else {
                setHataMesaji('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#e8efe9] flex items-center justify-center p-4 relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-200 opacity-50 z-0"></div>

            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 z-10 relative">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-green-800">Zihin Dostu</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">AI Danışman</p>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isLogin ? 'Hoş geldiniz' : 'Aramıza Katılın'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 px-4">
                        Kendi iç huzurunuza giden yolda bir adım daha.
                    </p>
                </div>

                {hataMesaji && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center">
                        {hataMesaji}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 ml-1 mb-1">Ad Soyad</label>
                            <input
                                type="text"
                                placeholder="Örn: Ahmet Yılmaz"
                                value={adSoyad}
                                onChange={(e) => setAdSoyad(e.target.value)}
                                required
                                className="w-full bg-[#f2f9f2] text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all placeholder-gray-400"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 ml-1 mb-1">E-posta</label>
                        <input
                            type="email"
                            placeholder="ornek@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#f2f9f2] text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 ml-1 mb-1">Şifre</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={sifre}
                            onChange={(e) => setSifre(e.target.value)}
                            required
                            className="w-full bg-[#f2f9f2] text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all placeholder-gray-400"
                        />
                        {isLogin && (
                            <div className="text-right mt-2">
                                <a href="#" className="text-xs text-green-600 hover:text-green-800 font-medium">Şifremi Unuttum</a>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3cdc5c] hover:bg-[#2ebf4a] text-white font-semibold rounded-xl px-4 py-3 mt-4 shadow-lg shadow-green-300 transition-all transform hover:scale-[1.02]"
                    >
                        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setHataMesaji('');
                        }}
                        className="text-green-600 font-bold hover:underline focus:outline-none"
                    >
                        {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </div>

            </div>

            <div className="absolute bottom-8 flex space-x-6 text-xs text-gray-500 z-10">
                <a href="#" className="hover:text-gray-800">Gizlilik Politikası</a>
                <a href="#" className="hover:text-gray-800">Yardım Merkezi</a>
            </div>
        </div>
    );
};

export default Auth;