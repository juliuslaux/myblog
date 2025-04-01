const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const blogschema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    date: String
});

const Blog = mongoose.model('Blog', blogschema);
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blog')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

app.get('/', async (req, res) => {
    try {
        const posts = await Blog.find().sort({ date: -1 });
        res.render('index', { posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).render('404', { message: 'Error fetching posts', posts: [] });
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    try {
        const { title, content } = req.body;
        const slug = generateSlug(title);
        
        const newPost = new Blog({
            title,
            slug,
            content,
            date: new Date().toLocaleDateString()
        });
        
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).render('404', { message: 'Error creating post', posts: [] });
    }
});

app.get('/blog/:slug', async (req, res) => {
    try {
        const post = await Blog.findOne({ slug: req.params.slug });
        if (post) {
            const posts = await Blog.find();
            res.render('post', { post, posts });
        } else {
            res.status(404).render('404', { message: 'Post not found', posts: [] });
        }
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).render('404', { message: 'Error fetching post', posts: [] });
    }
});

app.post('/blog/:slug/edit', async (req, res) => {
    try {
        const { title, content } = req.body;
        const slug = generateSlug(title);
        
        await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { title, slug, content }
        );
        
        res.redirect(`/blog/${slug}`);
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).render('404', { message: 'Error updating post', posts: [] });
    }
});

app.post('/blog/:slug/delete', async (req, res) => {
    try {
        await Blog.findOneAndDelete({ slug: req.params.slug });
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).render('404', { message: 'Error deleting post', posts: [] });
    }
});

app.use((req, res) => {
    res.status(404).render('404', { message: 'Post or Page not found', posts: [] });
});

app.listen(port, () => {
    console.log(`Blog server running at http://localhost:${port}`);
});