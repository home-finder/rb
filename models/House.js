const mongoose = require('mongoose');
const ImageSchema = require('./ImageSchema');

const HouseSchema = new mongoose.Schema({
  origin: String,
  idSource: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  title: String,
  contact: {
    phone: String,
  },
  images: [ImageSchema]
});

HouseSchema.pre('save', function(next){
  const currentDate = new Date();
  this.updatedAt = currentDate;
  
  if ( !this.createdAt ) {
    this.createdAt = currentDate;
  }
  next();
});

mongoose.model('House', HouseSchema);
