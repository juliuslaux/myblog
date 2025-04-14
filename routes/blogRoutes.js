const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const isAuthenticated = require('../middleware/auth');

// Helper function
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Create post page
router.get('/create', isAuthenticated, (req, res) => {
    res.render('create', { title: 'Create Post' });
});

router.post('/create', isAuthenticated, async (req, res) => {
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
        res.status(500).render('404', { 
            message: 'Error creating post', 
            posts: [], 
            title: 'Error'
        });
    }
});

router.get('/blog/:slug', async (req, res) => {
    try {
        const post = await Blog.findOne({ slug: req.params.slug });
        if (post) {
            const posts = await Blog.find();
            res.render('post', { post, posts, title: post.title });
        } else {
            res.status(404).render('404', { 
                message: 'Post not found', 
                posts: [], 
                title: 'Not Found'
            });
        }
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).render('404', { 
            message: 'Error fetching post',
            posts: [],
            title: 'Error'
        });
    }
});

router.post('/blog/:slug/edit', isAuthenticated, async (req, res) => {
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
        res.status(500).render('404', { message: 'Error updating post', posts: [], user: req.user });
    }
});

router.post('/blog/:slug/delete', isAuthenticated, async (req, res) => {
    try {
        await Blog.findOneAndDelete({ slug: req.params.slug });
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).render('404', { message: 'Error deleting post', posts: [], user: req.user });
    }
});

module.exports = router; 