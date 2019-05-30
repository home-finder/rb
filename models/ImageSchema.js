const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: String
});

mongoose.model('Image', ImageSchema);