const express = require("express");
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
//TODO: add images support + auth
router.post("/", /* auth, */ bookCtrl.createBook);
//TODO: controller + auth
router.post("/:id/rating", /*  auth,  */ bookCtrl.rateBook);

//updates book
//TODO: add images support + auth
router.put("/:id", /*  auth, */ bookCtrl.modifyBook);

router.delete("/:id", /* auth,  */ bookCtrl.deleteBook);

module.exports = router;
