const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userModel = mongoose.Schema({
  email : {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  password: { type: String, required: true },
});

userModel.plugin(uniqueValidator, {message: 'is already taken.'});

module.exports = mongoose.model('user', userModel);