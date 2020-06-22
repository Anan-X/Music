
    $('#sendPhoneCode').click(function(){
    let phone = $("input[name='phone']").val()
    $.get('/users/sendPhoneCodeRegister?phone='+phone,(data, status)=>{
      if(data['code']==200){
            alert("验证码发送成功")
        }else{
            alert("验证码发送失败，请稍后再试")
        }
    })
})

$("input[name='username']").blur(function(){
    let username = $("input[name='username']").val()
    $.get('/users/usernameused?username='+username,(data, status)=>{
      if(data['code']==200){
           alert("用户名已被注册")
        }else{
          alert(data['msg'])
        }
    })
})