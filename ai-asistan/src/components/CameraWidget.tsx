import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const CameraWidget: React.FC<{ onEmotionChange?: (emotion: string) => void }> = ({ onEmotionChange }) => {
    // 1. TİP EKLENTİSİ: useRef'in bir HTML video elementini işaret ettiğini belirtiyoruz
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
    const [dominantEmotion, setDominantEmotion] = useState<string>('Analiz ediliyor...');

    useEffect(() => {
        if (onEmotionChange) {
            onEmotionChange(dominantEmotion);
        }
    }, [dominantEmotion, onEmotionChange]);

    // 1. AŞAMA: Modelleri Yükle
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // public/models klasörüne bakar
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]);
            setIsModelLoaded(true);
        };
        loadModels();
    }, []);

    // 2. AŞAMA: Modeller yüklendikten sonra kamerayı aç
    useEffect(() => {
        if (isModelLoaded) {
            navigator.mediaDevices.getUserMedia({ video: true })
                // 2. TİP EKLENTİSİ: Gelen akışın MediaStream tipinde olduğunu belirtiyoruz
                .then((stream: MediaStream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err: unknown) => console.error("Kamera açılamadı:", err));
        }
    }, [isModelLoaded]);

    // 3. AŞAMA: Video oynamaya başlayınca yüz analizini başlat
    const handleVideoPlay = () => {
        setInterval(async () => {
            if (videoRef.current) {
                const detections = await faceapi.detectSingleFace(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceExpressions();

                if (detections) {
                    const expressions = detections.expressions;

                    // 3. TİP EKLENTİSİ: Object.keys normalde 'string[]' döner. 
                    // Bunu faceapi'nin beklediği anahtar tiplerine (keyof) zorluyoruz.
                    const keys = Object.keys(expressions) as Array<keyof faceapi.FaceExpressions>;

                    const maxEmotion = keys.reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );

                    // Çeviri objesinin tipini 'Record<string, string>' olarak belirliyoruz
                    const duyguCevirisi: Record<string, string> = {
                        happy: 'Mutlu 😊',
                        sad: 'Üzgün 😔',
                        angry: 'Kızgın 😠',
                        fearful: 'Korkmuş 😨',
                        disgusted: 'İğrenmiş 🤢',
                        surprised: 'Şaşırmış 😲',
                        neutral: 'Nötr 😐'
                    };

                    setDominantEmotion(duyguCevirisi[maxEmotion] || maxEmotion);
                } else {
                    setDominantEmotion('Yüz bulunamadı 🔍');
                }
            }
        }, 1000);
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 tracking-widest mb-4 w-full text-left">CANLI DUYGU ANALİZİ</div>

            <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                {!isModelLoaded ? (
                    <span className="text-white text-xs animate-pulse">AI Modelleri Yükleniyor...</span>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        onPlay={handleVideoPlay}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                )}
            </div>

            <div className="mt-4 w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 mb-1">Mevcut Durum</div>
                <div className="font-bold text-slate-700 text-lg transition-all duration-300">{dominantEmotion}</div>
            </div>
        </div>
    );
};

export default CameraWidget;