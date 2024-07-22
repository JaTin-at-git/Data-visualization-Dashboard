const express = require("express");
const router = express.Router();
const allController = require("../controllers/allController")

router.post("/addAll", allController.addAll);
router.get("/getFilters", allController.getFilters);
router.post("/getGraphData", allController.getGraphData);



module.exports = router;