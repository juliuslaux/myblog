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

app.get('/', async (req, res) => {
    try {
        res.render('index', { posts: [], user: null });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectToDatabase();
        const user = await User.findById(id).maxTimeMS(2000);
        done(null, user);
    } catch (err) {
        done(err);
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
    res.status(404).json({ error: 'Not Found' });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Blog server running at http://localhost:${port}`);
    });
}

module.exports = app;