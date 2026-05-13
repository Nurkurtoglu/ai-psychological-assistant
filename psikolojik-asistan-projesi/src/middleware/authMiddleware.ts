import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Request (İstek) objesine 'user' bilgisini ekleyebilmek için TypeScript arayüzü
export interface AuthRequest extends Request {
    user?: { id: string };
}

const JWT_SECRET = (process.env.JWT_SECRET as string);

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Frontend'den gelen isteğin başlığındaki (header) bileti alıyoruz
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ hata: "Erişim reddedildi. Giriş yapmanız gerekiyor." });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ hata: "Geçersiz veya eksik bilet." });
        return;
    }

    try {
        // Bileti kontrol et ve kimlik numarasını (id) çıkar
        const verified = jwt.verify(token, JWT_SECRET) as unknown as { id: string };
        req.user = verified; // Kimliği isteğin içine yerleştir
        next(); // İşleme devam etmesine izin ver
    } catch (error) {
        res.status(400).json({ hata: "Geçersiz veya süresi dolmuş bilet." });
    }
};