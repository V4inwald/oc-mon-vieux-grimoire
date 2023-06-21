const express = require("express");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");

const router = express.Router();

//sends back array of books
router.get("/", bookCtrl.getAllBooks);
//sends back book with given ID
router.get("/:id", bookCtrl.getOneBook);
//sends back array of 3 books with best averagerating
//TODO: controller
router.get("/bestrating", bookCtrl.getBestRatedBooks);

//creates book
router.post("/", auth, multer, bookCtrl.createBook);
//TODO
router.post("/:id/rating", auth, bookCtrl.rateBook);

//updates book
router.put("/:id", auth, multer, bookCtrl.modifyBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
