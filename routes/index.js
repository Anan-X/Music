var express = require('express');
var router = express.Router();
var music = require('../controllers/musicController');
var multer = require('multer');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/findMusic', function(req, res, next) {
  res.render('findMusic');
});
router.get('/musiclist',music.musiclist)
router.get('/findsort',music.findsort)   //查照自己的歌单名称

router.get('/addMyPlayList',music.addMyPlayList)  //将歌曲添加到自己的歌单里

router.get('/getSortPlayList',music.getSortPlayList) // 获取用户的歌单列表

router.get('/createOk',music.createOk) // 创建歌单

router.get('/deletePlayList',music.deletePlayList) //删除歌单

router.get('/myMusic',music.getmusic)

router.get('/uploadMusic',function(req, res, next) {
  res.render('uploadMusic');
});

router.post('/uploadmusicok',multer({
  //设置文件存储路径
 dest: './public/upload/musics'   //upload文件如果不存在则会自己创建一个。
}).single('file'), music.uploadmusicok);

router.get('/music_remove',music.music_remove)
module.exports = router;
