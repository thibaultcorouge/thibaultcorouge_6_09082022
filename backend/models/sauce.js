const mongoose = require('mongoose');


// Sauce schema creation in order to store it in dataBase (mongoose method).

const sauceSchema = mongoose.Schema({
  userId:{ type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true},
  description:{ type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true},
  heat:{ type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked:{ type: [String] },
  usersDisliked: { type: [String] },
});


module.exports = mongoose.model('Sauce', sauceSchema); //model method transform this model in a usable model.