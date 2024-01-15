const env = require('dotenv').config();

module.exports = {
    mongoURI: process.env.mongoURI, 
    SESSION_SECRET: process.env.SESSION_SECRET,    
};