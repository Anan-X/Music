var dbCofing = require('../util/dbconfig');
var config = require('../util/aliconfig');
var Core = require('@alicloud/pop-core');

// 配置
let client = new Core(config.alicloud)
let requestOption = {
  method: 'POST'
};
validatePhoneCode = []
// 随机验证码生成
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
// 登录页面
login = (req, res) =>{
    res.render('login')
}
// 登录提交
loginOk = (req, res) =>{
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
                res.redirect(301,'http://127.0.0.1:3000/myMusic');
            }else{
                
                res.send('用户名或密码错误');
            }
        }
        res.end()
    }
    dbCofing.sqlConnect(sql, sqlArr, callback);
}
// 注销
loginOut = (req, res) =>{
    req.session.userName =null;
    res.redirect(301,'http://127.0.0.1:3000/users/')
}
// 注册页面
register = (req, res) =>{
    res.render('register')
}
// 手机发送验证码接口
sendPhoneCode = (req, res) =>{
    let phone = req.query.phone;
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
// 手机号登录
loginPhoneOk = (req, res) =>{
    
}
module.exports = {
    login,
    loginOk,
    loginOut,
    register,
    sendPhoneCode
}