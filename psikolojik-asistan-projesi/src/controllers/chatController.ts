import { type Request, type Response } from 'express';
import { aiModel, embeddingModel } from '../config/gemini.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Knowledge from '../models/Knowledge.js';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { kullaniciMesaji, anlikDuygu } = req.body;

        if (!kullaniciMesaji) {
            res.status(400).json({ hata: "Mesaj alanı boş olamaz." });
            return;
        }

        // ==========================================
        // 1. RAG SİSTEMİ: MESAJI VEKTÖRE ÇEVİR
        // ==========================================
        const queryEmbeddingResult = await embeddingModel.embedContent(kullaniciMesaji);
        const queryVector = queryEmbeddingResult.embedding.values;

        // ==========================================
        // 2. MONGODB'DEN BENZER TAVSİYELERİ BUL
        // ==========================================
        const kaynaklar = await Knowledge.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index_rag",
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": 10,
                    "limit": 3 // En iyi 3 paragraf
                }
            },
            {
                "$project": {
                    "baslik": 1,
                    "icerik": 1
                }
            }
        ]);

        // ==========================================
        // 3. BULUNAN PDF BİLGİLERİNİ BİRLEŞTİR
        // ==========================================
        let psikolojikBaglam = "";
        if (kaynaklar.length > 0) {
            psikolojikBaglam = kaynaklar.map(k => `Kitap/Bölüm (${k.baslik}): ${k.icerik}`).join("\n\n");
        } else {
            psikolojikBaglam = "Veritabanında doğrudan eşleşen bir teknik bulunamadı. Genel empatik yeteneklerini kullan.";
        }

        // ==========================================
        // 4. GEMINI'YE O EFSANEVİ PROMPT'U GÖNDER
        // ==========================================
        const finalPrompt = `
      Sen Zihin Dostu adında uzman, empatik ve destekleyici bir psikolojik asistansın.
      Kullanıcının kameradan okunan anlık duygu durumu: ${anlikDuygu || 'Bilinmiyor'}
      
      Aşağıda, senin kendi zihninden (veritabanından) çekilmiş güvenilir, bilimsel psikolojik kaynaklar (kitap özetleri, teknikler) var:
      """
      ${psikolojikBaglam}
      """
      
      KULLANICI MESAJI: "${kullaniciMesaji}"
      
      GÖREVİN: 
      1. Kullanıcının şu anki "${anlikDuygu || 'Bilinmiyor'}" duygusunu göz önünde bulundurarak çok şefkatli ve empatik bir giriş yap.
      2. Yukarıdaki güvenilir kaynaklarda yer alan teknikleri (nefes, düşünce düzeltme vb.) kullanarak kullanıcıya adım adım, pratik tavsiyeler ver. Asla "Şu kaynağa göre" deme, sanki bu teknikleri sen kendin biliyormuşsun gibi doğal bir dille anlat.
      3. Cevabın bir psikoloğun odasındaymış gibi sıcak olsun, bir robot gibi liste sunma.
    `;

        const result = await aiModel.generateContent(finalPrompt);
        const aiCevabi = result.response.text();

        // Başarılı olursa cevabı React'e geri gönder
        res.status(200).json({
            gonderen: 'ai',
            mesaj: aiCevabi,
            tespitEdilenDuygu: anlikDuygu
        });

    } catch (error) {
        console.error("Sohbet Hatası:", error);
        res.status(500).json({ hata: "Yapay zeka şu an yanıt veremiyor, lütfen birazdan tekrar deneyin." });
    }
};

// Seans kaydetme fonksiyonun (endSession) kusursuz olduğu için aynen bırakıyorum
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