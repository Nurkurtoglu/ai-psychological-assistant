import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';
import dotenv from 'dotenv';
import Knowledge from '../models/Knowledge.js';
import { embeddingModel } from '../config/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 🧠 AKILLI PARÇALAYICI ALGORİTMAMIZ
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function metniParcalaraBol(metin: string, maxKarakter: number = 1000): string[] {
    const paragraflar = metin.split(/\n\s*\n/);
    let chunklar: string[] = [];
    let guncelChunk = "";

    for (const paragraf of paragraflar) {
        const temizParagraf = paragraf.replace(/\s+/g, ' ').trim();
        if (!temizParagraf || temizParagraf.length < 10) continue;

        if ((guncelChunk + " " + temizParagraf).length > maxKarakter) {
            if (guncelChunk) chunklar.push(guncelChunk.trim());
            guncelChunk = temizParagraf;
        } else {
            guncelChunk += (guncelChunk ? " " : "") + temizParagraf;
        }
    }
    if (guncelChunk) chunklar.push(guncelChunk.trim());
    return chunklar;
}

async function otomatikPdfYukle() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("✅ MongoDB'ye bağlanıldı.");

        // DİKKAT: Senin klasör yapına göre ana dizindeki 'data' klasörüne gidiyoruz
        const pdfKlasoru = path.join(__dirname, '../../data');
        const dosyalar = fs.readdirSync(pdfKlasoru).filter(file => file.endsWith('.pdf'));

        if (dosyalar.length === 0) {
            console.log("⚠️ Uyarı: 'data' klasöründe hiç PDF bulunamadı!");
            process.exit(1);
        }

        console.log(`📂 ${dosyalar.length} adet PDF bulundu. Okuma başlıyor...`);

        await Knowledge.deleteMany({} as any);

        for (const dosya of dosyalar) {
            console.log(`\n📄 Okunuyor: ${dosya}`);
            const dosyaYolu = path.join(pdfKlasoru, dosya);
            const dataBuffer = fs.readFileSync(dosyaYolu);

            const parser = new PDFParse({ data: dataBuffer });
            const pdfVerisi = await parser.getText();
            const tamMetin = pdfVerisi.text;

            const chunklar = metniParcalaraBol(tamMetin, 1000);
            console.log(`✂️ Dosya ${chunklar.length} parçaya bölündü. Vektörleştiriliyor...`);

            for (let i = 0; i < chunklar.length; i++) {
                const chunkMetni = chunklar[i];
                if (!chunkMetni) continue;
                
                let vektor = null;
                let maxRetries = 3;
                for (let r = 0; r < maxRetries; r++) {
                    try {
                        const result = await embeddingModel.embedContent(chunkMetni);
                        vektor = result.embedding.values;
                        break;
                    } catch (err: any) {
                        if (r === maxRetries - 1) throw err; // Son denemeyse hatayı fırlat
                        process.stdout.write(` [Sunucu Hatası, 5sn bekleniyor...] `);
                        await delay(5000); // Hatadan sonra 5 saniye dinlendir
                    }
                }

                if (!vektor) continue;

                await Knowledge.create({
                    kategori: dosya.replace('.pdf', ''),
                    baslik: `${dosya.replace('.pdf', '')} - Bölüm ${i + 1}`,
                    icerik: chunkMetni,
                    embedding: vektor
                });
                process.stdout.write(`.`);
                
                // Gemini API Rate Limit (429 Too Many Requests) hatasını önlemek için 2 saniye bekle
                await delay(2000);
            }
        }

        console.log("\n\n🎉 MÜTHİŞ! Tüm PDF'ler otomatik okundu, parçalandı, vektörlendi ve veritabanına eklendi!");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Hata:", error);
        process.exit(1);
    }
}

otomatikPdfYukle();