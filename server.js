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

const port = process.env.PORT || 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
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
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Add this after passport configuration but before routes
app.use((req, res, next) => {
    res.locals.user = req.user;  // Make user available in all views
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Import routes
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);
app.use('/', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Post or Page not found', posts: [] });
});

app.listen(port, () => {
    console.log(`Blog server running at http://localhost:${port}`);
});