const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // password Hashing in order to secure the signup 
        .then(hash => { // creating user and store it in the database with an answer positif if it's a success or an error if it's a failure 
            const user = new User({
                email: cryptoJs.SHA256(req.body.email, process.env.RANDOM_KEY_SECRET).toString(), //email: email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'utilisateur créé'}))
            .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error })); 
};


exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJs.SHA256(req.body.email, process.env.RANDOM_KEY_SECRET).toString() }) //email: req.body.email // mongoose method to compare e-mail with the database if there's not e-mail user stored = error if there's keep going.
        .then(user => { 
            if(!user) {
                return res.status(401).json({ error : 'Utilisateur non trouvé'})
            }
            bcrypt.compare(req.body.password, user.password) // compare : bcrypt method to compare password typed by user and hash stored in database , if different => error else => 200 response and return Id with a token 
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect'})
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign( // Sign : jsonwebtoken function to encode a new token with a payload( userId ) 
                        { userId: user._id},
                        process.env.RANDOM_TOKEN_SECRET, // random_token_secret to encode the token(this one is not enough complex for produtcion) //difference from the github file for the .env
                        { expiresIn: '24h'} // 24h token time duration
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};