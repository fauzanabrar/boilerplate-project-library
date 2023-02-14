const mongoose = require('mongoose')

// create an schema
var bookSchema = new mongoose.Schema({
    title: String,
    comments:[String],
    commentcount: Number
});

module.exports = mongoose.model("Book", bookSchema);