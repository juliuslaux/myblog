const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    date: String
});

module.exports = mongoose.model('Blog', blogSchema); 