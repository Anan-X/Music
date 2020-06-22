var dbCofing = require('../util/dbconfig');
var config = require('../util/aliconfig');
var Core = require('@alicloud/pop-core');

// 配置
let client = new Core(config.alicloud)
let requestOption = {
  method: 'POST'
};
let validatePhoneCode = []
// 随机验证码生成
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
// 登录页面
let login = (req, res) =>{
    res.render('login')
}
// 登录提交
let loginOk = (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password)
    let sql = `select * from users where username=? and password=?`;
    let sqlArr = [username, password];
    let callback = (err, data)=>{
        console.log(data)
        if(err){
            console.log(err);
        }else{
            if(data.length == 1){
                let datastr = JSON.stringify(data);
                let dataObj = JSON.parse(datastr)
                req.session.userName = dataObj[0].username;
                res.redirect(301,'http://127.0.0.1:3000/myMusic?username='+dataObj[0].username);
            }else{
                
                res.send('用户名或密码错误');
            }
        }
        res.end()
    }
    dbCofing.sqlConnect(sql, sqlArr, callback);
}
// 注销
let loginOut = (req, res) =>{
    req.session.userName =null;
    res.redirect(301,'http://127.0.0.1:3000/users/')
}
// 注册页面
let register = (req, res) =>{
    res.render('register')
}

// 注册时创建表格
let creatTable = (req, res, username) =>{
  // let username = req.query.username
  let sql = 
        "CREATE TABLE IF NOT EXISTS `"+ username +"`("+
          "id INT UNSIGNED AUTO_INCREMENT,"+
          "username VARCHAR(100) NOT NULL,"+
          "time VARCHAR(40),"+
          "singer VARCHAR(40),"+
          "album VARCHAR(40),"+
          "musiclist_id INT(4),"+
          "musicword VARCHAR(10000),"+
          "sort VARCHAR(40),"+
          "path VARCHAR(255),"+
          "PRIMARY KEY ( id )"+
      ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
  let sqlArr =[]
 
  return dbCofing.SySqlConnect(sql, sqlArr)
}
// 注册时判读
// 注册提交处理
let registerOk = (req, res)=>{
  let {username, phone, code, password} = req.body
  if(phoneCodeif(phone, code)){
    // 插入用户注册信息
    let sql =`insert into users(username, password, phone,musicinfo) values(?,?,?,?)`
    let sqlArr = [username,password,phone,username]
    dbCofing.SySqlConnect(sql, sqlArr)
    // 创建用户存储歌单信息表
    creatTable(req,res,username)
    res.redirect(301,'http://127.0.0.1:3000/users/');
  }else{
    res.send({
      "code":400,
      "msg":"手机号和验证码不匹配"
    })
  }
}
// 判读用户名是否已被注册
let usernameused = async(req, res)=>{
  let username = req.query.username
  let sql = `select * from users where username=?`;
  let sqlArr = [username];
  let result = await dbCofing.SySqlConnect(sql, sqlArr)
  console.log(result.length)
  if(result.length){
      res.send({
        "code":200,
        "msg":"用户名已被注册"
      })
  }else{
    res.send({
      "code": 400,
      "msg": "用户名可用"
    }
    )
  }
}
// 判断手机号是否已注册
let findPhone = async (phone) =>{
  let sql = `select * from users where phone=?`;
  let sqlArr = [phone];
  let res = await dbCofing.SySqlConnect(sql, sqlArr)
  return res.length
}
// 注册页面手机发送验证码接口
let sendPhoneCodeRegister = async (req, res) =>{
  let phone = req.query.phone;
  if(await findPhone(phone)){    // 先判断手机是否已经注册
    res.send({
      'msg':"该手机号已经被注册过了"
    })
  }else{
    let code = rand(1000, 9000);
    let params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": phone,
      "SignName": "莲美App",
      "TemplateCode": "SMS_192195277",
      "TemplateParam": JSON.stringify({
        'code': code
      })
    }
    client.request('SendSms', params, requestOption).then((result) => {
      if (result.Code == 'OK') {
        res.send({
          'code': 200,
          'msg': '发送成功'
        });
        validatePhoneCode.push({
          'phone': phone,
          'code': code
        });
        console.log(code);
      } else {
        res.send({
          'code': 400,
          'msg': '发送失败'
        });
      }
    }, (ex) => {
      console.log(ex);
    })
  }
}
// 手机发送验证码接口
let sendPhoneCode = async (req, res) =>{
    let phone = req.query.phone;
    if(await findPhone(phone)){    // 先判断手机是否已经注册
      let code = rand(1000, 9000);
      let params = {
        "RegionId": "cn-hangzhou",
        "PhoneNumbers": phone,
        "SignName": "莲美App",
        "TemplateCode": "SMS_192195277",
        "TemplateParam": JSON.stringify({
          'code': code
        })
      }
      client.request('SendSms', params, requestOption).then((result) => {
        if (result.Code == 'OK') {
          res.send({
            'code': 200,
            'msg': '发送成功'
          });
          validatePhoneCode.push({
            'phone': phone,
            'code': code
          });
          console.log(code);
        } else {
          res.send({
            'code': 400,
            'msg': '发送失败'
          });
        }
      }, (ex) => {
        console.log(ex);
      })
    }else{
      res.send({
        "msg":"手机号没注册"
      })
    }
}
// 模拟验证码发送接口
let sendCode = (req, res) => {
  let phone = req.query.phone;
  // if (sendCodePhone(phone)) {
  //   res.send({
  //     'code': 400,
  //     'msg': '已经发送过验证码，稍后重试'
  //   })
  // }
  let code = rand(1000, 9999);
  validatePhoneCode.push({
    'phone': phone,
    'code': code
  })
  console.log(validatePhoneCode);
  res.send({
    'code': 200,
    'msg': '发送成功'
  })
  console.log(code);
}
// 判断手机号和验证吗是否匹配
let phoneCodeif = (phone,code) =>{9
  for(let item of validatePhoneCode){
    console.log(item.phone)
    console.log(item.code)
    if(item.phone==phone && item.code==code) return true
  }
  return false
}
// 手机号登录
let loginPhoneOk = (req, res) =>{
  let {phone,code} = req.body
  console.log(phoneCodeif(phone, code))
  if(phoneCodeif(phone,code)){
    let sql = `select username from users where phone=?`
    let sqlArr =[phone]
    let callback =(err, data)=>{
      if(err){
        res.send({
          'code':400,
          "msg":"查询用户名失败"
        })
      }else{
        let datastr = JSON.stringify(data)
        let dataObj = JSON.parse(datastr)
        let username = dataObj[0].username
        req.session.userName = username
        res.redirect(301,'http://127.0.0.1:3000/myMusic?username='+username);
      }
    }
    dbCofing.sqlConnect(sql, sqlArr, callback)
  }else{
    res.send('手机号和验证码不匹配')
  }
}
module.exports = {
    login,
    loginOk,
    loginOut,
    register,
    sendPhoneCode,
    loginPhoneOk,
    registerOk,
    sendPhoneCodeRegister,
    usernameused,
    sendCode,
    creatTable
}