const Category = require('../models/Category');
const fs = require('fs');

const config = require('../config/config');


// Create a new category
exports.createCategory = async (req, res) => {
  try {
 
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

// Get total number of categories
exports.getTotalCategories = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    res.status(200).json({ totalCategories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total categories', error: error.message });
  }
}