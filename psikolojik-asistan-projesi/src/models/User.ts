import mongoose from 'mongoose';

// Kullanıcı Şeması Taslağı
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


export default mongoose.model('User', userSchema);