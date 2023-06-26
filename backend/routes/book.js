const express = require("express");
const multer = require("../middleware/multer-config");
const imageOptimization = require("../middleware/sharp-config");
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");

const router = express.Router();

//sends back array of books
router.get("/", bookCtrl.getAllBooks);
//TODO
//sends back array of 3 books with best averagerating
router.get("/bestrating", bookCtrl.getBestRatedBooks);
//sends back book with given ID
router.get("/:id", bookCtrl.getOneBook);

//creates book
router.post("/", auth, multer, imageOptimization, bookCtrl.createBook);
//rates book
router.post("/:id/rating", auth, bookCtrl.rateBook);

//updates book
router.put("/:id", auth, multer, imageOptimization, bookCtrl.modifyBook);
//deletes one book
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
