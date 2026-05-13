import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const [seanslar, setSeanslar] = useState<any[]>([]);
    const [hata, setHata] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); // Token yoksa doğrudan giriş sayfasına at
                return;
            }

            try {
                // İsteği atarken bileti (token) Header içinde gönderiyoruz!
                const response = await axios.get('http://localhost:3000/api/chat/history', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSeanslar(response.data);
            } catch (error) {
                setHata('Geçmiş bilgileriniz alınırken bir sorun oluştu.');
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#e8efe9] p-8">
            <div className="max-w-3xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800">Geçmiş Seanslarım</h1>
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Sohbete Dön
                    </button>
                </div>

                {hata && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">{hata}</div>}

                {seanslar.length === 0 && !hata ? (
                    <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
                        Henüz kaydedilmiş bir seansınız bulunmuyor. Zihin Dostu ile sohbet etmeye başlayın!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {seanslar.map((seans, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-sm text-gray-500 font-medium">
                                        {new Date(seans.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${seans.baskinDuygu.includes('Mutlu') ? 'bg-green-100 text-green-700' :
                                        seans.baskinDuygu.includes('Üzgün') || seans.baskinDuygu.includes('Endişeli') ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {seans.baskinDuygu}
                                    </span>
                                </div>
                                <p className="text-gray-700">
                                    <strong className="text-green-800">Yapay Zeka Özeti:</strong> {seans.aiOzeti}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;