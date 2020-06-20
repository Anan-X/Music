var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
/* GET users listing. */
router.get('/',user.login);

router.post('/loginOk',user.loginOk);

router.get('/loginout',user.loginOut);

router.get('/register',user.register);

router.get('/sendPhoneCode',user.sendPhoneCode);
module.exports = router;
