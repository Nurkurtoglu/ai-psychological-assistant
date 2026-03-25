import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    kullaniciId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    baskinDuygu: {
        type: String,
        required: true
    },
    aiOzeti: {
        type: String,
        required: true
    },

    //   // 3. Arayüzdeki "Günün Egzersizi" widget'ı için AI'ın önerisi
    //   tavsiyeEgzersiz: { 
    //     type: String,
    //     default: "Derin Nefes (4-7-8 Tekniği)" 
    //   }
}, {
    timestamps: true
});

export default mongoose.model('Session', sessionSchema);