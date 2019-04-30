const express = require('express');
const router = express.Router();
const conPm = require('../controller/con-pm');
const checkAuth = require('../middleware/check-auth');


/* ****************************Get Assesment**************************** */
router.get('/get/image', checkAuth, conPm.getUsrPm);

/* ****************************Save User Assesment**************************** */
router.post('/add/image', checkAuth, conPm.addPartsMap);

module.exports = router;