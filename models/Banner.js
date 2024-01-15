const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {   
    header: { type: String },
    paragraph: { type: String }, 
    images: [
      {
        type: String,  
      },
    ],   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);