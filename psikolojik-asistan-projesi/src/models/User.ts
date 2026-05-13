import mongoose, { Document, Model } from 'mongoose';

// 1. TypeScript'e özel "Arayüz" (Interface) tanımlıyoruz
// Bu sayede TS, User tablomuzda "email", "adSoyad" ve "sifre" olduğunu kesin olarak bilecek.
export interface IUser extends Document {
    adSoyad: string;
    email: string;
    sifre: string;
}

// 2. Bildiğimiz MongoDB Şemamız
const userSchema = new mongoose.Schema({
    adSoyad: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sifre: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// 3. Modeli dışarı aktarırken <IUser> diyerek TypeScript ile tanıştırıyoruz
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;