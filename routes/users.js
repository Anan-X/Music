var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
/* GET users listing. */
router.get('/',user.login);
router.post('/loginOk',user.loginOk);
router.get('/loginout',user.loginOut);

router.get('/register',user.register);
router.post('/registerOk',user.registerOk);

router.get('/usernameused',user.usernameused)
router.get('/sendPhoneCodeRegister',user.sendPhoneCodeRegister)
router.get('/sendPhoneCode',user.sendPhoneCode);
router.post('/loginPhoneOk', user.loginPhoneOk);
router.get('/sendCode',user.sendCode)
router.get('/createtable',user.creatTable)
module.exports = router;
