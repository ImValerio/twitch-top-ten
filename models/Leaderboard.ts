import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const leaderboard = new Schema({
    idStreamer: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
    }

},{collection: 'leaderboard'});

// mongoose.models = {};

const Leaderboard = mongoose.model('leaderboard', leaderboard);

export default Leaderboard;