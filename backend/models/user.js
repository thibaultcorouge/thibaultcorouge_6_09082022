const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



const userSchema = mongoose.Schema({ // User schema creation in order to store it in dataBase (mongoose method).
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); //plugin for mail management (unique mail)

module.exports = mongoose.model('User', userSchema); //model method transform this model in a usable model.