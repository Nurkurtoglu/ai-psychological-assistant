import { type Request, type Response } from 'express';
import { aiModel } from '../config/gemini.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {

        const { kullaniciMesaji, anlikDuygu } = req.body;

        if (!kullaniciMesaji) {
            res.status(400).json({ hata: "Mesaj alanı boş olamaz." });
            return;
        }

        // Yapay zekaya göndereceğimiz arka plan prompt'unu hazırlıyoruz
        // Bu sayede AI, kullanıcının o anki yüz ifadesini de bilecek!
        const aiPrompt = `
      Kullanıcının kameradan okunan anlık duygu durumu: ${anlikDuygu || 'Bilinmiyor'}
      Kullanıcının mesajı: "${kullaniciMesaji}"
      
      Lütfen kullanıcının duygu durumunu da göz önünde bulundurarak ona uygun empatik bir yanıt ver.
    `;

        // Gemini'ye soruyu soruyoruz
        const result = await aiModel.generateContent(aiPrompt);
        const aiCevabi = result.response.text();

        // Başarılı olursa cevabı React'e geri gönderiyoruz
        res.status(200).json({
            gonderen: 'ai',
            mesaj: aiCevabi,
            tespitEdilenDuygu: anlikDuygu
        });

    } catch (error) {
        console.error("Yapay Zeka Hatası:", error);
        res.status(500).json({ hata: "Yapay zeka şu an yanıt veremiyor, lütfen birazdan tekrar deneyin." });
    }
};

export const endSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mesajlar } = req.body;
        
        if (!mesajlar || mesajlar.length === 0) {
            res.status(400).json({ hata: "Kaydedilecek mesaj bulunamadı." });
            return;
        }

        const sohbetMetni = mesajlar.map((m: any) => `${m.gonderen === 'kullanici' ? 'Kullanıcı' : 'AI'}: ${m.mesaj}`).join('\n');

        const prompt = `
            Aşağıdaki sohbetin kısa bir özetini çıkar ve kullanıcının genel baskın duygusunu tek kelimeyle (örneğin: "Mutlu", "Üzgün", "Endişeli") tespit et.
            Yanıtını sadece aşağıdaki formatta geçerli bir JSON objesi olarak dön:
            {
                "ozet": "string",
                "baskinDuygu": "string"
            }

            Sohbet:
            ${sohbetMetni}
        `;

        const result = await aiModel.generateContent(prompt);
        let aiCevabi = result.response.text();

        aiCevabi = aiCevabi.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(aiCevabi);

        let user = await User.findOne();
        if (!user) {
            user = await User.create({ adSoyad: 'Test Kullanıcısı', email: 'test@example.com', sifre: '123456' });
        }

        const yeniOturum = await Session.create({
            kullaniciId: user._id,
            baskinDuygu: parsed.baskinDuygu,
            aiOzeti: parsed.ozet
        });

        res.status(200).json({ mesaj: "Seans başarıyla kaydedildi.", session: yeniOturum });
    } catch (error) {
        console.error("Seans kaydetme hatası:", error);
        res.status(500).json({ hata: "Seans kaydedilirken bir hata oluştu." });
    }
};