const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, },
    images: [
      {
        type: String,  
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sizes:  [{ type: String }],
    availability:  [{ type: String }],
    colors: [{ type: String }],
    price: { type: Number, required: true },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);