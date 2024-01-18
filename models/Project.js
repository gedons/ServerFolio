const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, },

    imageUrl: {
      type: String, 
    },
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    url:  { type: String },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);