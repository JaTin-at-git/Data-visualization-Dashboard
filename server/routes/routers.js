const express = require("express");
const router = express.Router();
const allController = require("../controllers/allController")

router.post("/addAll", allController.addAll);


module.exports = router;