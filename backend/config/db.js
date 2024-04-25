const mongoose = require('mongoose');

// Connection URL



// Function to connect to MongoDB
async function connectToDatabase() {
    const mongoUrl = "mongodb+srv://nilaybhotmange2002:pI1jwzfB4OHgJQ8S@cluster0.quhgaqv.mongodb.net/LoadDash";

    try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDatabase;

