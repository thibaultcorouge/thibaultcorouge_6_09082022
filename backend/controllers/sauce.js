const Sauce = require('../models/sauce');
const fs = require('fs');

// method exportation

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};


// Sauce element creation
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
  
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// return One sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

//modify the sauce only by the user who create the sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//delete a sauce only by the user who create the sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { // fs : package with method to interact with the file system on the server . unlink() method let us delete a file from the file system
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};


// If 1 like, if -1 dislike
// the user cannot like and dislike at the same time and only one like/dislike by user.
exports.likeDislike = (req, res, next) => {
  if (req.body.like === 1) { 
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: 'Like' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) { 
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
      .then((sauce) => res.status(200).json({ message: 'Dislike' }))
      .catch(error => res.status(400).json({ error }));
  } else { 
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Like deleted' }) })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike deleted' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};


