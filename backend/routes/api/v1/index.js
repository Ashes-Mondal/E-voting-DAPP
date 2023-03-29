const express = require("express");
const router = express.Router();

router.use('/user',require('./user'));
router.use('/election',require('./election'));

// Exporting routes
module.exports = router;