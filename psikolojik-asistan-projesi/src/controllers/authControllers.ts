import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as string;

// 1. KAYIT OLMA FONKSİYONU
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // Artık istekten adSoyad bilgisini de alıyoruz
        const { adSoyad, email, sifre } = req.body;

        const eskiKullanici = await User.findOne({ email });
        if (eskiKullanici) {
            res.status(400).json({ hata: "Bu e-posta adresi zaten kullanılıyor." });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const sifrelenmisSifre = await bcrypt.hash(sifre, salt);

        // Veritabanına kaydederken adSoyad'ı da ekliyoruz
        const yeniKullanici = await User.create({
            adSoyad,
            email,
            sifre: sifrelenmisSifre
        });

        res.status(201).json({ mesaj: "Kayıt başarıyla oluşturuldu." });
    } catch (error) {
        console.error("Kayıt Hatası:", error);
        res.status(500).json({ hata: "Sunucu hatası oluştu." });
    }
};

// 2. GİRİŞ YAPMA FONKSİYONU
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, sifre } = req.body;

        // Kullanıcıyı bul
        const kullanici = await User.findOne({ email });
        if (!kullanici) {
            res.status(404).json({ hata: "Kullanıcı bulunamadı." });
            return;
        }

        // Şifre doğru mu kontrol et
        const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
        if (!sifreDogruMu) {
            res.status(400).json({ hata: "Hatalı şifre girdiniz." });
            return;
        }

        // Giriş başarılıysa Token (Bilet) oluştur
        const token = jwt.sign({ id: kullanici._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            mesaj: "Giriş başarılı.",
            token,
            email: kullanici.email
        });
    } catch (error) {
        console.error("Giriş Hatası:", error);
        res.status(500).json({ hata: "Sunucu hatası oluştu." });
    }
};