const Blog = require('../models/Blog');
const Category = require('../models/Category');
const config = require('../config/config');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const dropbox = new Dropbox({
   accessToken: process.env.DROPBOX_ACCESS_TOKEN,
   fetch  
});


//Create Blog
exports.createBlog = async (req, res) => {
   const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

   // request body
    const { title, url } = req.body;


 
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const path = `/uploads/${file.filename}`;
  
      const fileData = await dropbox.filesUpload({
        path: path,
        contents: fileBuffer,
      });
    
  
      // path for creating a shared link
      const sharedLinkPath = { path: fileData.result.path_display };
  
      // Create a shared link for the file
      const sharedLink = await dropbox.sharingCreateSharedLinkWithSettings(sharedLinkPath);
  
      // Extract the link from the shared link
      let imageUrl = sharedLink.result.url;

      imageUrl = imageUrl.replace(/dl=0/, 'raw=1');


  //save to database
     const newBlog = new Blog({
        title,
        imageUrl,
        url,
    });
  
      try {
        await newBlog.save();
        res.status(201).send('Blog created successfully');
      } catch (err) {
        console.error('Error creating blog', err);
        return res.status(500).send('Error creating blog');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ message: 'Error getting blogs', error: error.message });
    }
};


// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.blogId);
      if (!blog) {
        return res.status(404).json({ message: 'blog not found' });
      }
      res.status(200).json({ blog });
    } catch (error) {
      res.status(500).json({ message: 'Error getting blog', error: error.message });
    }
};

// Update a project by ID
exports.updateBlogById = async (req, res) => {
  try {
    
     const { title, url } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      {  title, url },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Blog update failed', error: error.message });
  }
};

// Delete a product by ID
exports.deleteBlogById = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Check if the project exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the Blog
    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Blog deletion failed', error: error.message });
  }
};

// Get total number of blogs
exports.getTotalBlogs = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    res.status(200).json({ totalBlogs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total blogs', error: error.message });
  }
}
