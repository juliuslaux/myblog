const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

async function createUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ username: 'admin' });
        if (existingUser) {
            console.log('User already exists');
            process.exit(0);
        }

        // Create new user
        const user = new User({
            username: 'admin',
            password: 'admin123'  // This will be hashed by the pre-save hook
        });

        await user.save();
        console.log('User created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

createUser(); 