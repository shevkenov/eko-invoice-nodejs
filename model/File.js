const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName:{
        type: String,
        required: [true, "Filename is required!"],
        unique: [true, "Filename already imported"],
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('File', fileSchema);