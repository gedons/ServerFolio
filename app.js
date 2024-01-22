const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const config = require('./config/config');

const authRoute = require('./routes/authRoute');
const categoryRoutes = require('./routes/categoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
 
dotenv.config();

const corsOptions = {
  //origin: 'https://www.daeds.uk', 
  origin: 'http://localhost:5173', 
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect(config.mongoURI, {
    w: 1
  })
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log('MongoDb Error: ', err);
  });

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/blogs', blogRoutes);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Backend server running at port: ${port}`);
});