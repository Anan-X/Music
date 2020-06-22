$("#loginPhone").click(function(){
    $('#formPass').hide();
    $("#formPhone").show();
})
$("#loginPass").click(function(){
    $('#formPhone').hide();
    $("#formPass").show();
})

$('#sendPhoneCode').click(function(){
    let phone = $("input[name='phone']").val()
    $.get('/users/sendPhoneCode?phone='+phone,(data, status)=>{
        if(data['code']==200){
            alert("验证码发送成功")
        }else{
            alert("验证码发送失败，请稍后再试")
        }
    })
})