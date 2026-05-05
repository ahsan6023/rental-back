const express = require("express");
const equipments = require("../data/equipments");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(equipments);
});

module.exports = router;
