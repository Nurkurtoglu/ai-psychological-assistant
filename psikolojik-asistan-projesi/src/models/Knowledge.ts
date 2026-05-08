import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema({
    kategori: {
        type: String,
        required: true
    },
    baslik: {
        type: String,
        required: true
    },
    icerik: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

const Knowledge = mongoose.models.Knowledge || mongoose.model('Knowledge', knowledgeSchema);

export default Knowledge;