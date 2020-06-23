var dbCongif = require('../util/dbconfig.js')
var fs = require('fs');

// 获取数据库所有音乐
let musiclist = (req, res)=>{
    let sql = `select * from musiclist`
    let sqlArr = []
    let callBack = (err, data) =>{
        if(err){
            console.log(err)
            return
        }else{
            if(data.length){
                let datastr = JSON.stringify(data)
                let dataObj = JSON.parse(datastr)
                res.send(dataObj)
            }
        }
    }
    dbCongif.sqlConnect(sql, sqlArr, callBack)
}

//获取music_list用户表
let getmusic = (req, res) =>{
    console.log('session')
    console.log(req.session.userName +'4444')
    // dataObj[0].username
    if(req.session.userName){
        let tablename =req.session.userName
        // console.log(tablename)
        var sql = "select * from "+tablename
        var sqlArr = []
        var callBack = (err, data) => {
            if(err){
            console.log('连接出错')
            }else{
            // 要把数据转换成JSON格式发到页面
            let reslutStr = JSON.stringify(data); 
            let reslutObj = JSON.parse(reslutStr)
            //   console.log("aaaaa"+reslutObj)
            res.render('myMusic', { musiclist: reslutObj, userName:req.session.userName});
            }
        }
        dbCongif.sqlConnect(sql, sqlArr, callBack)
    }else{
        res.redirect('http://127.0.0.1:3000/users/')
        console.log('未登录')
    }
    
}

// 获取分类是我喜欢的音乐列表
let getmylovemusic = (req, res, next) =>{
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
let getsensitivemusic = (req, res, next) =>{
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
// 获取用户的歌单名称
let findsort = (req, res)=>{
    let username = req.session.userName
    console.log(username+'  2222')
    if(username){
        let sql = `SELECT distinct sort FROM `+ username +` where sort is not null and sort <>''`
        let sqlArr = []
        let callBack = (err, data) =>{
            if(err){
                console.log(err)
                return
            }else{
                let datastr = JSON.stringify(data)
                let dataObj = JSON.parse(datastr)
                console.log(dataObj)
                res.send(dataObj)
            }
        }
        dbCongif.sqlConnect(sql, sqlArr, callBack)
    }else{
        res.send({
            'code':400,
            'msg':'未登录'
        })
    }
    
}

// 查询此曲是否当前歌单已经有了
let addMyPlayListIf = (req, id, sort)=>{
    let sql = `select * from `+req.session.userName+` where musiclist_id=? and sort=?`
    let sqlArr = [id, sort]
    return dbCongif.SySqlConnect(sql, sqlArr)
}
 //    复制曲库的歌曲的信息
 let copyMusic = async(req, res, id ,sort) =>{
     let sql = ` select * from musiclist where id=?`
     let sqlArr = [id]
     let result = await dbCongif.SySqlConnect(sql, sqlArr)
     let resultstr = JSON.stringify(result)
     let resultObj = JSON.parse(resultstr)
    //  console.log(resultObj)
     let musicname = resultObj[0].musicname
     let time = resultObj[0].time
     let singer = resultObj[0].singer
     let album = resultObj[0].album
     let musiclist_id = id
     let musicword = resultObj[0].musicword
     let path = resultObj[0].path
     let sqlb = `insert into `+req.session.userName+`(musicname,time,singer,album,musiclist_id,musicword,sort,path) values(?,?,?,?,?,?,?,?)`
     let sqlbArr = [musicname, time, singer, album, musiclist_id, musicword, sort, path]
     let callBack = (err, data) =>{
         if(err){
             console.log(err)
             return
         }else{
             if(data.affectedRows==1){
                 res.send({
                     "code":200,
                     "msg": "添加成功"
                 })
             }else{
                 res.send({
                     "code":400,
                     "msg":"添加失败"
                 })
             }
         }
     }
     dbCongif.sqlConnect(sqlb, sqlbArr, callBack)
 }
//将歌曲添加到自己的歌单里
let addMyPlayList = async(req, res) =>{
    let id = req.query.id
    let sort = req.query.sort
    let result = await addMyPlayListIf(req, id, sort)
     // 把歌曲插入到自己的歌单
    if(!result.length){
    //    复制曲库的歌曲的信息
    copyMusic(req,res,id,sort)
    }else{
        res.send({
            "code":400,
            "msg":"此曲已在你的歌单里"
        })
    }
}
// 文件上传
let uploadmusicok = (req, res, next) =>{
    if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
        res.render("error", {message: "上传文件不能为空！"});
        return
    } else {
       let file = req.file;
       console.log(file);
       fs.renameSync('public/upload/musics/' + file.filename, 'public/upload/musics/' + file.originalname);//这里修改文件名字，比较随意。
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
        res.redirect('/myMusic');
    }
}
// 移除歌单
let music_remove = (req, res) =>{
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
    music_remove,
    musiclist,
    findsort,
    addMyPlayList
}