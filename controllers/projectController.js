const Project = require('../models/Project');
const Category = require('../models/Category');
const config = require('../config/config');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const fs = require('fs');

const dropbox = new Dropbox({
   accessToken: 'sl.Bt6Yrdqr9UuUpTi5dmzQVbYhO6o2cF4rJsHpfa6ilDSnkcjzX1qnwWtDqzFH2ur-lxovrQxuydWvsVxEhd2vlsMbgH9hIPuh4fIeuncWsGDTDaO9ZKy582MQ613tCvyS9iKjNgWiIk_mmKo',
   fetch  
});


//Create Project
exports.createProject = async (req, res) => {
   const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

   //Other request body
    const { title, description, url, categoryId } = req.body;

   // Check if the specified category exists
   const category = await Category.findById(categoryId);
   if (!category) {
     return res.status(404).json({ message: 'Category not found' });
   }

  
 
  
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
      const newProject = new Project({
        title,
        description,
        imageUrl,
        url,
        category: categoryId,
      });
  
      try {
        await newProject.save();
        res.status(201).send('Project created successfully');
      } catch (err) {
        console.error('Error creating project', err);
        return res.status(500).send('Error creating project');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find().populate('category');
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ message: 'Error getting projects', error: error.message });
    }
};


// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId).populate('category');
      if (!project) {
        return res.status(404).json({ message: 'project not found' });
      }
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ message: 'Error getting project', error: error.message });
    }
};

// Get projects by category
exports.getProjectByCategory = async (req, res) => {
    try {
      const projects = await Project.find({ category: req.params.categoryId }).populate('category');
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ message: 'Error getting projects by category', error: error.message });
    }
};

// get related products by category
exports.getRelatedProductsByCategory = async (req, res) => {
  try {
    const productId = req.params.productId;

    
    const product = await Product.findById(productId);
    const categoryId = product.category; 

    // Find other products with the same category (excluding the current product)
    const relatedProducts = await Product.find({
      category: categoryId,
      _id: { $ne: productId },
    }).limit(5);  
    
    res.status(200).json({ relatedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error getting related products', error: error.message });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Permission denied. Only admin users can update products.' });
    }

    const {  title, description,  sizes, colors, availability, price, categoryId } = req.body;

    // Check if the specified category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {  title, description, sizes, colors, availability, price, category: categoryId },
      { new: true }
    ).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Product update failed', error: error.message });
  }
};


// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Permission denied. Only admin users can delete products.' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.productId).populate('category');

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Loop through each image path in the deleted product's images array
    deletedProduct.images.forEach(async (imagePath) => {
      // Extract the image filename from the GCS path
      const filename = imagePath.split('/').pop();
      
      // Get the file from Google Cloud Storage
      const file = bucket.file(filename);

      // Delete the file from the bucket
      await file.delete();
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed', error: error.message });
  }
};

// Get total number of products
exports.getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ totalProducts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total products', error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    // Perform a case-insensitive search for products containing the query in their name
     const products = await Product.find({ title: {$regex:searchQuery, $options: "i"} }).populate('category');

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
}