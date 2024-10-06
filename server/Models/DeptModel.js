const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
     }
  });
  
  module.exports = mongoose.model('Dept', deptSchema);
  