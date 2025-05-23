const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Blog = require('./models/Blog');

// Optimized for Vercel deployment - Fixed MongoDB connection

// Quick response route for testing
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is responding' });
});

// MongoDB connection with faster timeout
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        const mongoOptions = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            family: 4 // Force IPv4
        };

        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        
        // Test the connection
        await conn.connection.db.admin().ping();
        
        isConnected = true;
        console.log('Successfully connected to MongoDB');
        
        // Handle disconnection events
        mongoose.connection.on('disconnected', () => {
            console.log('Lost MongoDB connection...');
            isConnected = false;
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        isConnected = false;
        // Log more details about the error
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any MongoDB servers');
            console.error('Connection string:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        }
        throw error;
    }
};

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic routes that don't require DB
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Session configuration for Vercel
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false, // Set to false even in production for Vercel
        httpOnly: true
    }
};

// Apply middleware
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Force session save on every request to ensure it's stored
app.use((req, res, next) => {
    req.session.touch();
    next();
});

// Passport configuration
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            await connectToDatabase();
            const user = await User.findOne({ username }).maxTimeMS(2000);
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return done(null, false, { message: 'Incorrect password.' });
            
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Force session to be saved to store on login
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    if (user && user.id) {
        return done(null, user.id);
    } else {
        return done(new Error('User serialization failed - invalid user object'));
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user ID:', id);
        await connectToDatabase();
        const user = await User.findById(id).maxTimeMS(5000);
        if (!user) {
            console.log('User not found for ID:', id);
            return done(null, false);
        }
        console.log('User found:', user.username);
        return done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        return done(err);
    }
});

// Add this after passport configuration but before routes
app.use((req, res, next) => {
    // Always log auth status
    console.log('Auth middleware - Session ID:', req.sessionID);
    console.log('Auth middleware - isAuthenticated:', req.isAuthenticated());
    console.log('Auth middleware - User:', req.user ? req.user.username : 'none');
    
    // Store authentication in res.locals for all templates
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    
    // For debugging, add to res.locals
    res.locals.debug = {
        sessionID: req.sessionID,
        authenticated: req.isAuthenticated(),
        user: req.user ? req.user.username : 'none'
    };
    
    next();
});

// Root route - moved here after all middleware
app.get('/', async (req, res) => {
    try {
        // Ensure we're connected to the database
        await connectToDatabase();
        
        // Get all posts
        const posts = await Blog.find().sort({ date: -1 });
        
        // Render the index view with posts and auth info
        res.render('index', { 
            title: 'Home',
            posts: posts
        });
    } catch (error) {
        console.error('Error in root route:', error);
        res.status(500).render('404', { 
            title: 'Error',
            message: 'Error loading home page', 
            posts: []
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Import and use routes
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', authRoutes);
app.use('/', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Not Found',
        message: 'The page you were looking for does not exist',
        posts: []
    });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Blog server running at http://localhost:${port}`);
    });
}

module.exports = app;