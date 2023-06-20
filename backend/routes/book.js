const express = require("express");
const bookCtrl = require("../controllers/book");

const router = express.Router();

//sends back array of books
router.get("/", bookCtrl.getAllBooks);
//sends back book with given ID
router.get("/:id", bookCtrl.getOneBook);
//sends back array of 3 books with best averagerating
//TODO: controller
router.get("/bestrating", bookCtrl.getBestRatedBooks);

//creates book
//TODO: add images support + auth
router.post("/", bookCtrl.createBook);
//TODO: controller + auth
router.post("/:id/rating", bookCtrl.rateBook);

//updates book
//TODO: add images support + auth
router.put("/:id", bookCtrl.modifyBook);

router.delete("/:id", bookCtrl.deleteBook);

module.exports = router;
