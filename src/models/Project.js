const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    //Nekhdo el user ID automatically mel token, fi 3Odh may7oto howa wa7do (more secure)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['in progress', 'completed', 'paused'],
        default: 'in progress'
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;