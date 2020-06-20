var express = require('express');
var router = express.Router();
var music = require('../controllers/musicController');
var multer = require('multer');
var dbCongif = require('../util/dbconfig.js')
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/findMusic', function(req, res, next) {
  res.render('findMusic', { title: 'Express' });
});
router.get('/myMusic',music.getmusic);
router.get('/uploadMusic',function(req, res, next) {
  res.render('uploadMusic', { title: 'Express' });
});
router.get('/ajax',(req, res) =>{
  res.send('ajax');
  
});
router.get('/getmylovemusic',music.getmylovemusic);
router.get('/getsensitivemusic',music.getsensitivemusic);
router.post('/uploadmusicok',multer({
  //设置文件存储路径
 dest: './public/upload/musics'   //upload文件如果不存在则会自己创建一个。
}).single('file'), music.uploadmusicok);

router.get('/music_remove',music.music_remove)
module.exports = router;
