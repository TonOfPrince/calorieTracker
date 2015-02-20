var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var EntrySchema = new Schema({
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  time: { type: Date, default: Date.now },
  // time: { type: Number },
  text: { type: String },
  calories: { type: Number }
});

module.exports = mongoose.model('Entry', EntrySchema);
