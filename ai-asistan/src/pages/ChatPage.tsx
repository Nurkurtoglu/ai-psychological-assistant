import { useState } from 'react';

import CameraWidget from '../components/CameraWidget';
import LeftMenu from '../components/LeftMenu';
import ChatBox from '../components/ChatBox';
import RightMenu from '../components/RightMenu';

function ChatPage() {

    const [mesajlar, setMesajlar] = useState<{ gonderen: string, mesaj: string }[]>([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [anlikDuygu, setAnlikDuygu] = useState('Nötr 😐');



    return (
        <div className="flex h-screen w-full bg-white font-sans text-slate-800 overflow-hidden">

            {/* 1. BÖLME: SOL PANEL (Menü) */}
            <LeftMenu />
            {/* 2. BÖLME: ORTA PANEL (Chat Alanı) */}
            <ChatBox
                mesajlar={mesajlar}
                setMesajlar={setMesajlar}
                anlikDuygu={anlikDuygu}
                yukleniyor={yukleniyor}
                setYukleniyor={setYukleniyor}
            />
            <CameraWidget onEmotionChange={setAnlikDuygu} />

            {/* 3. BÖLME: SAĞ PANEL (Widget'lar) */}
            <RightMenu />

        </div>
    );
}

export default ChatPage;