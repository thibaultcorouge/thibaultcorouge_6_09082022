const jwt = require('jsonwebtoken'); //JSON web tokens : encoded token who can be used for authorization

//Users authentication by a mere comparison of tokens

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET); //difference from the github file for the .env
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ 
      error: new Error ('Invalid request!')
    });
  }
};