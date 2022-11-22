import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const streamer = new Schema({
    id: {
        type: String,
        required: true,
    },
    totalPoints: {
        type: Number,
        required: true,
    }
});

mongoose.models = {};

const Streamer = mongoose.model('streamers', streamer);

export default Streamer;