const Book = require("../models/book");
const fs = require("fs");

//creates a book
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  //checks if image is send
  if (!req.file) {
    return res.status(400).json({ error });
  }

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    //I reconstruct the url
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.fileName}`,
    averageRating: bookObject.ratings[0].grade,
  });
  book
    .save()
    //status code 200 and not 201 because I'm sending back a message
    .then(() => res.status(200).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book === null) {
        res.status(404).json({ error: "Ce livre n'existe pas !" });
      } else if (
        book.ratings.find((rating) => rating.userId === req.auth.userId)
      ) {
        //forbidden because the book has already been rated
        res.status(403).json({ error: "Livre déja noté !" });
      } else {
        //add the new grade
        //frontend sends it as "rating" instead of "grade"
        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
        //calculate the averageRating
        const totalRatings = book.ratings.reduce(
          (total, rating) => total + rating.grade,
          0
        );
        book.averageRating = totalRatings / book.ratings.length;
        //save book and handle the answer
        book
          .save()
          //status code 200 and not 201 because I'm sending back the book
          .then((book) => res.status(200).json(book))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//sends back array of books
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      if (Object.keys(books).length === 0) {
        //status 204 no content
        res.status(204).send();
      } else {
        res.status(200).json(books);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//sends back book with given ID
exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book === null) {
        res.status(404).json({ error: "Ce livre n'existe pas !" });
      } else {
        res.status(200).json(book);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//sends back array of 3 books with best averagerating
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    //sort in descending number (bigger to smaller)
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
};

//updates book
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? //if a new image is send
      {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.fileName}`,
      }
    : //if no image is send
      { ...req.body };

  Book.findById(req.params.id)
    .then((book) => {
      // console.log("book : " + book);
      if (book === null) {
        return res.status(404).json({ error: "Ce livre n'existe pas !" });
      } else if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "403: unauthorized request" });
      } else if (req.file) {
        //if new image is send unlinks the previous image
        const filename = book.imageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {});
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Livre modifié!" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book === null) {
        res.status(404).json({ error: "Ce livre n'existe pas !" });
      } else if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
