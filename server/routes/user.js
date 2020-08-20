const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { read, update } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);
// only admin can update user
router.put('/admin/update', requireSignin, adminMiddleware, update);
router.put('/user/update', requireSignin, update);

module.exports = router;
