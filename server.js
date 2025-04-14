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

// MongoDB connection with faster timeout
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 3000, // Reduce timeout
            socketTimeoutMS: 3000,
            connectTimeoutMS: 3000,
            maxPoolSize: 10
        });
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        isConnected = false;
        throw error;
    }
};

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session configuration optimized for serverless
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            await connectToDatabase();
            const user = await User.findOne({ username }).maxTimeMS(2000);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            
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

// Add this after passport configuration but before routes
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        res.locals.user = req.user;
        next();
    } catch (error) {
        next(error);
    }
});

// Basic route for quick testing
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Import routes
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.use('/', authRoutes);
app.use('/', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Post or Page not found', posts: [] });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Blog server running at http://localhost:${port}`);
    });
}

module.exports = app;