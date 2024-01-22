const Blog = require('../models/Blog');
const Category = require('../models/Category');
const config = require('../config/config');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const fs = require('fs');

const dropbox = new Dropbox({
   accessToken: 'sl.BuIU7pViV2WuRN0ZRbfV_05DhS17eT23iRuQqukJK2zcl25KtwjF-0983VkguKvgg1SCWBY7NlZxdcPPoiblo8zBDX4mKagrlk3o2NWIal8yvxIwbKrosd_Vm2D3sGhn4RlJkKSvxR03YH4',
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
      const imageUrl = sharedLink.result.url;


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
exports.getProjectById = async (req, res) => {
    try {
      const blog = await Project.findById(req.params.projectId).populate('category');
      if (!project) {
        return res.status(404).json({ message: 'project not found' });
      }
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ message: 'Error getting project', error: error.message });
    }
};


// Update a project by ID
exports.updateProjectById = async (req, res) => {
  try {
    
     const { title, description, url, categoryId } = req.body;
    console.log(req.body);

    // Check if the specified category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {  title, description, url, category: categoryId },
      { new: true }
    ).populate('category');

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Project update failed', error: error.message });
  }
};

// Delete a product by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Check if the project exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Project deletion failed', error: error.message });
  }
};

// Get total number of products
exports.getTotalProjects = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    res.status(200).json({ totalProjects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total projects', error: error.message });
  }
}
