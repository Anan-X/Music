var dbCongif = require('../util/dbconfig.js')
var fs = require('fs');



// 获取music_list用户表
getmusic = function(req, res, next) {
    console.log(req.session.userName)
    // dataObj[0].username
    if(req.session.userName){
        let tablename =req.query.username
        // console.log(tablename)
        var sql = "select * from "+tablename +""
        
        var sqlArr = []
        var callBack = (err, data) => {
            if(err){
            console.log('连接出错')
            }else{
            // 要把数据转换成JSON格式发到页面
            let reslutStr = JSON.stringify(data); 
            let reslutObj = JSON.parse(reslutStr)
            //   console.log("aaaaa"+reslutObj)
            res.render('myMusic', { musiclist: reslutObj, userName:tablename });
            }
        }
        dbCongif.sqlConnect(sql, sqlArr, callBack)
    }else{
        res.redirect(301,'http://127.0.0.1:3000/users/')
    }
    
}
// 获取分类是我喜欢的音乐列表
getmylovemusic = (req, res, next) =>{
    let tablename =req.query.username
    let sql = "select * from "+tablename +" where sort=?";
    var sqlArr =['我喜欢的音乐'];
    var callBack = (err, data) =>{
        if(err){
            console.log("查询我喜欢歌曲失败");
        }else{
        //     let reslutStr = JSON.stringify(data); 
        //   let reslutObj = JSON.parse(reslutStr)
            // res.render('myMusic', { musiclist: reslutObj });
        res.send(data)
        }
    }
    dbCongif.sqlConnect(sql, sqlArr, callBack)
}
// 获取分类是感性的音乐列表
getsensitivemusic = (req, res, next) =>{
    let tablename =req.query.username
    let sql = "select * from "+ tablename +" where sort=?";
    var sqlArr =['感性'];
    var callBack = (err, data) =>{
        if(err){
            console.log("查询感性失败");
        }else{
        //     let reslutStr = JSON.stringify(data); 
        //   let reslutObj = JSON.parse(reslutStr)
        //   console.log(reslutObj)
        //     res.render('myMusic', { musiclist: reslutObj });
        res.send(data)
        }
    }
    dbCongif.sqlConnect(sql, sqlArr, callBack)
}
// 文件上传
uploadmusicok = (req, res, next) =>{
    if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
        res.render("error", {message: "上传文件不能为空！"});
        return
    } else {
       let file = req.file;
       let fileInfo = {};
       console.log(file);
       fs.renameSync('public/upload/musics/' + file.filename, 'public/upload/musics/' + file.originalname);//这里修改文件名字，比较随意。
       // 获取文件信息
      //  fileInfo.mimetype = file.mimetype;
      //  fileInfo.originalname = file.originalname;
      //  fileInfo.size = file.size;
      //  fileInfo.path = file.path;
       // 设置响应类型及编码
    //    res.set({
    //      'content-type': 'application/json; charset=utf-8'
    //   });
      let data = req.body;
      let datastr = JSON.stringify(data);
      let dataObj = JSON.parse(datastr);
      console.log(dataObj);
        let sql = `insert into musiclist(musicname, singer, time, album, sort, musicword ,path) values(?, ?, ?, ?, ?, ?, ?)`;
        // console.log(file.path)
        let musicpath = `upload/musics/`+file.originalname;
        let sqlArr = [dataObj.musicname, dataObj.singer, dataObj.time, dataObj.album, dataObj.sort, dataObj.musicword, musicpath]
        dbCongif.sqlConnect(sql, sqlArr,(err,data)=>{
            if(err){
              console.log(err);
              throw '出错了';
            }else{
              if(data.affecteRows==1){
                  res.end({
                      'code':200,
                      'msg':'修改成功',
                    
                  })
              }else{
                  res.end({
                      'code':400,
                      'msg':'修改失败'
                  })
              }
            }
        })
        res.redirect(301,'http://127.0.0.1:3000/myMusic');
    }
}
// 移除歌单
music_remove = (req, res) =>{
    let id = req.query.id;
    let sql = `update musiclist set sort='' where id=?`;
    let sqlArr =[id];
    let callBack =(err, data) =>{
        if(err){
            console.log("移除失败");
            return
        }else{
            res.send({
                'code':200,
                'mgs':'修改成功'
            })
        }
    }
    dbCongif.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
    getmusic,
    getmylovemusic,
    getsensitivemusic,
    uploadmusicok,
    music_remove
}