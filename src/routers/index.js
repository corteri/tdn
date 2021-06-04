const express = require('express');
const router = express.Router();
router.use("/profile",require('./profile'));
router.use("/do",require('./do'));
module.exports = router;