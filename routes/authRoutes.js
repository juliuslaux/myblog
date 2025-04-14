const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/auth');

// Login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login handler
router.post('/login', (req, res, next) => {
    console.log('Login attempt:', req.body.username);
    
    // Check if credentials are provided
    if (!req.body.username || !req.body.password) {
        console.log('Missing credentials');
        return res.render('login', { error: 'Username and password are required' });
    }
    
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error details:', err.message, err.stack);
            return res.render('login', { 
                error: 'Authentication error: ' + (process.env.NODE_ENV === 'development' ? err.message : 'Please try again later')
            });
        }
        
        if (!user) {
            console.log('Authentication failed:', info && info.message);
            return res.render('login', { error: info && info.message ? info.message : 'Invalid username or password' });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error details:', err.message, err.stack);
                return res.render('login', { 
                    error: 'Login error: ' + (process.env.NODE_ENV === 'development' ? err.message : 'Please try again later')
                });
            }
            
            console.log('Login successful, redirecting to home');
            return res.redirect('/');
        });
    })(req, res, next);
});

// Logout handler
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Password update page
router.get('/update-password', isAuthenticated, (req, res) => {
    res.render('update-password', { error: null, success: null });
});

// Password update handler
router.post('/update-password', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    try {
        // Verify current password
        const user = await User.findById(req.user.id);
        const isValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isValid) {
            return res.render('update-password', { 
                error: 'Current password is incorrect',
                success: null
            });
        }
        
        // Verify new passwords match
        if (newPassword !== confirmPassword) {
            return res.render('update-password', { 
                error: 'New passwords do not match',
                success: null
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.render('update-password', { 
            error: null,
            success: 'Password updated successfully'
        });
    } catch (err) {
        console.error('Password update error:', err);
        res.render('update-password', { 
            error: 'An error occurred while updating password',
            success: null
        });
    }
});

module.exports = router; 