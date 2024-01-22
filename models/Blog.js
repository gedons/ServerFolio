const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },    

    imageUrl: {
      type: String, 
    },
    
    url:  { type: String },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);