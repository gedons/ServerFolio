const env = require('dotenv').config();

module.exports = {
    mongoURI: process.env.mongoURI, 
    SESSION_SECRET: process.env.SESSION_SECRET,  
    DROPBOX_ACCESS_TOKEN: process.env.DROPBOX_ACCESS_TOKEN  

};