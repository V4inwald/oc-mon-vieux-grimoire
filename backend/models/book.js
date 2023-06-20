const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  //MongoDB unique identifier of the user that created the book
  userId: { type: String, required: true },
  //title of the book
  title: { type: String, required: true },
  //author of the book
  author: { type: String, required: true },
  //illustration/cover of the book
  imageUrl: { type: String, required: true },
  //publication year of the book
  year: { type: Number, required: true },
  //genre of the book
  genre: { type: String, required: true },
  //all the ratings given to a book
  ratings: [
    {
      //MongoDB unique identifier of the user that rated the book
      userId: { type: String, required: false },
      //one grade given to a book
      grade: { type: Number, required: false },
    },
  ],
  //average rating of a book
  averageRating: { type: Number, required: false },
});

module.exports = mongoose.model("Book", bookSchema);
