const Category = require('../models/Category');
const fs = require('fs');

const config = require('../config/config');

const keyFilename = config.googleAppCredentials;

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'project-molding',
  keyFilename: keyFilename,
});
const bucket = storage.bucket('project-molding_bucket');


// Create a new category
exports.createCategory = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Permission denied. Only admin users can create categories.' });
    }

    const { name } = req.body;

    const newCategory = new Category({
      name,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Category creation failed', error: error.message });
  }
};

// Handle image upload for a specific category by ID
exports.uploadCategoryImage = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const fileName = req.file.originalname;
    const file = bucket.file(fileName);

    // Create a write stream to upload the file
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      res.status(500).json({ message: 'Failed to upload image', error: err.message });
    });



    stream.on('finish', async () => {
      // Once the file is successfully uploaded, add its GCS path to the product's images array
      const gcsImagePath = `https://storage.googleapis.com/project-molding_bucket/${fileName}`;
      category.imageUrl = gcsImagePath;

      const updatedCategory = await category.save();

      res.status(200).json({ message: 'Image added successfully', imageUrl: updatedCategory });
    });

    stream.end(req.file.buffer);      
  } catch (error) {
    console.error('Error uploading category image:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ message: 'Error getting categories', error: error.message });
    }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
    return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
} catch (error) {
    res.status(500).json({ message: 'Error getting category', error: error.message });
}
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied. Only admin users can update categories.' });
      }
  
      const { name } = req.body;
  
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        { name },
        { new: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      res.status(500).json({ message: 'Category update failed', error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied. Only admin users can delete categories.' });
      }
  
      const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Delete associated image from the uploads folder
      if (deletedCategory.imageUrl) {
        const imagePath = `.${deletedCategory.imageUrl}`; 
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting category image:', err);
            // Handle error if needed
          }
        });
      }
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Category deletion failed', error: error.message });
    }
};